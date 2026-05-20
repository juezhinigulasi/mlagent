'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import HistoryPanel from './HistoryPanel';
import ChatWindow, { Message } from './ChatWindow';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

interface SingleChatLayoutProps {
  title: string;
  featureId: string;
  history: { id: string; title: string; time: string; preview: string }[];
  activeHistoryId: string | null;
  onHistorySelect: (id: string) => void;
  onNewSession: () => void;
  onDelete: (id: string) => void;
}

const replies: Record<string, string> = {
  polish: '【文案润色大师】正在为您润色文案...',
  prompt: '【提示词大师】正在为您生成提示词...',
  chapter: '【章节大师】正在为您构思章节...',
  topic: '【veo 8秒提示词】正在为您生成标题...',
  cover: '【封面标题章节】正在为您创作提示词...',
};

// 需要连接 Dify API 的功能模块
const apiFeatures = ['prompt', 'polish', 'cover', 'topic', 'chapter'];

export default function SingleChatLayout({
  title,
  featureId,
  history,
  activeHistoryId,
  onHistorySelect,
  onNewSession,
  onDelete,
}: SingleChatLayoutProps) {
  const { getActiveSessionMessages, addMessage, getConversationId, setConversationId } = useChat();
  const { points } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const sessionMessages = getActiveSessionMessages(featureId);
    setMessages(sessionMessages);
  }, [featureId, activeHistoryId, getActiveSessionMessages]);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!activeHistoryId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };

    addMessage(featureId, activeHistoryId, newMessage);
    setMessages(prev => [...prev, newMessage]);

    // 判断是否需要调用 Dify API
    if (apiFeatures.includes(featureId)) {
      // 检查积分
      if (points <= 0) {
        const errorReply: Message = {
          id: (Date.now() + 1).toString(),
          content: '抱歉，您的积分不足，请联系管理员获取积分后再使用。',
          isUser: false,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
        addMessage(featureId, activeHistoryId, errorReply);
        return;
      }
      setIsStreaming(true);
      setStreamingContent('');
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      abortControllerRef.current = new AbortController();

      try {
        const conversationId = getConversationId(featureId);
        
        console.log('Sending request to /api/dify:', { message, conversationId, featureId });
        
        const response = await fetch('/api/dify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: message,
            conversationId: conversationId || null,
            featureId: featureId,
          }),
          signal: abortControllerRef.current.signal,
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          let errorDetails = 'Unknown error';
          try {
            const errorBody = await response.json();
            errorDetails = errorBody.details || errorBody.error || 'Request failed';
          } catch (e) {
            errorDetails = await response.text();
          }
          console.error('API request failed:', response.status, errorDetails);
          throw new Error(`API request failed: ${errorDetails}`);
        }

        if (!response.body) {
          console.error('Response body is null');
          throw new Error('Empty response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let fullContent = '';
        let receivedConversationId: string | null = null;

        console.log('Starting to read streaming response...');

        while (true) {
          const { done, value } = await reader.read();
          
          if (done || abortControllerRef.current?.signal.aborted) {
            console.log('Streaming done or aborted');
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim());

          console.log('Received chunk with', lines.length, 'lines');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.slice(6);
                const data = JSON.parse(jsonStr);
                
                console.log('Raw parsed data:', JSON.stringify(data));
                
                // Handle conversation_id from different locations
                if (data.conversation_id && !receivedConversationId) {
                  receivedConversationId = data.conversation_id;
                  console.log('Received conversation_id:', receivedConversationId);
                  if (receivedConversationId && activeHistoryId) {
                    setConversationId(featureId, activeHistoryId, receivedConversationId);
                  }
                }
                
                if (data.message?.conversation_id && !receivedConversationId) {
                  receivedConversationId = data.message.conversation_id;
                  console.log('Received conversation_id from message:', receivedConversationId);
                  if (receivedConversationId && activeHistoryId) {
                    setConversationId(featureId, activeHistoryId, receivedConversationId);
                  }
                }
                
                // Check for content in different possible locations
                let textContent = '';
                
                // Format 1: Dify streaming message_delta event (most common)
                if (data.event === 'message_delta' && data.delta?.content) {
                  textContent = data.delta.content;
                  console.log('Found content in message_delta:', textContent);
                }
                // Format 2: data.message.content.text
                else if (data.message?.content?.text) {
                  textContent = data.message.content.text;
                }
                // Format 3: data.message.content (if it's a string)
                else if (data.message?.content && typeof data.message.content === 'string') {
                  textContent = data.message.content;
                }
                // Format 4: data.content
                else if (data.content) {
                  textContent = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
                }
                // Format 5: data.answer (common in some Dify responses)
                else if (data.answer) {
                  textContent = data.answer;
                }
                // Format 6: data.message (if message is a string)
                else if (typeof data.message === 'string') {
                  textContent = data.message;
                }
                // Format 7: Check if there's any text field
                else if (data.text) {
                  textContent = data.text;
                }
                // Format 8: delta.text
                else if (data.delta?.text) {
                  textContent = data.delta.text;
                }
                
                if (textContent) {
                  fullContent += textContent;
                  console.log('Accumulated content length:', fullContent.length);
                  setStreamingContent(fullContent);
                }
              } catch (e) {
                console.error('Failed to parse response line:', e, line);
              }
            }
          }
        }

        console.log('Final content:', fullContent);

        if (fullContent) {
          const replyMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: fullContent,
            isUser: false,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          };
          addMessage(featureId, activeHistoryId, replyMessage);
        } else {
          console.warn('Empty content received from API');
          const emptyReply: Message = {
            id: (Date.now() + 1).toString(),
            content: '抱歉，未能获取到响应。请检查Dify应用配置或稍后重试。',
            isUser: false,
            timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
          };
          addMessage(featureId, activeHistoryId, emptyReply);
        }
      } catch (error) {
        console.error('API error:', error);
        const errorReply: Message = {
          id: (Date.now() + 1).toString(),
          content: `抱歉，服务暂时不可用。错误信息：${(error as Error).message}`,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };
        addMessage(featureId, activeHistoryId, errorReply);
      } finally {
        setIsStreaming(false);
        setStreamingContent('');
      }
    } else {
      // 非 API 功能，使用模拟回复
      setTimeout(() => {
        const replyMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: replies[featureId] || replies.polish,
          isUser: false,
          timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        };

        addMessage(featureId, activeHistoryId, replyMessage);
      }, 1000);
    }
  }, [featureId, activeHistoryId, addMessage, getConversationId, setConversationId, points]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const displayMessages = isStreaming && streamingContent
    ? [...messages, { id: 'streaming', content: streamingContent, isUser: false, timestamp: '' }]
    : messages;

  return (
    <div className="flex-1 flex h-full">
      <HistoryPanel
        history={history}
        activeId={activeHistoryId}
        onSelect={onHistorySelect}
        title={title}
        onNewSession={onNewSession}
        onDelete={onDelete}
      />
      <ChatWindow 
        title={title} 
        messages={displayMessages} 
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
      />
    </div>
  );
}
