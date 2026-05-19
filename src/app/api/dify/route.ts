import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { query, conversationId, featureId } = body;

  // 根据功能模块选择对应的 API 密钥
  let apiKey: string | undefined;
  let apiKeyName: string;

  if (featureId === 'polish') {
    apiKey = process.env.DIFY_API_KEY_COPYWRITER;
    apiKeyName = 'DIFY_API_KEY_COPYWRITER';
  } else if (featureId === 'prompt') {
    apiKey = process.env.DIFY_API_KEY_PROMPT;
    apiKeyName = 'DIFY_API_KEY_PROMPT';
  } else if (featureId === 'cover') {
    apiKey = process.env.DIFY_API_KEY_COVER;
    apiKeyName = 'DIFY_API_KEY_COVER';
  } else {
    // 默认使用提示词大师的密钥
    apiKey = process.env.DIFY_API_KEY_PROMPT;
    apiKeyName = 'DIFY_API_KEY_PROMPT';
  }

  if (!apiKey) {
    console.error(`${apiKeyName} environment variable is not set`);
    return NextResponse.json({ error: `${apiKeyName} not configured` }, { status: 500 });
  }

  try {
    console.log('Dify API request received:', { query, conversationId, featureId });

    const response = await fetch('https://api.dify.ai/v1/chat-messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        response_mode: 'streaming',
        user: 'user-ml-agent',
        inputs: {},
        query,
        conversation_id: conversationId || '',
      }),
    });

    console.log('Dify API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Dify API error:', response.status, errorText);
      return NextResponse.json({ error: 'Dify API request failed', details: errorText }, { status: response.status });
    }

    if (!response.body) {
      console.error('Dify API response body is null');
      return NextResponse.json({ error: 'Empty response body' }, { status: 500 });
    }

    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal server error', details: (error as Error).message }, { status: 500 });
  }
}
