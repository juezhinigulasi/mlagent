import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-zinc-900 dark:via-zinc-900 lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="h-4 w-4"
              width={24}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome to{' '}
          <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Next.js
          </span>
        </h1>
        <p className="mt-6 text-center text-lg leading-8 text-gray-600 dark:text-gray-400">
          Get started by editing{' '}
          <code className="rounded-md bg-gray-100 px-2 py-1 font-mono text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            src/app/page.tsx
          </code>
        </p>
        <div className="mt-10 flex items-center gap-8">
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Read our docs
          </a>
          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-900 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800"
          >
            Learn Next.js
          </a>
        </div>
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-52 left-1/4 -translate-x-1/4 translate-y-1/4 w-[56rem] h-[56rem] rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20 blur-3xl" />
        <div className="absolute -bottom-52 right-1/4 translate-x-1/4 translate-y-1/4 w-[56rem] h-[56rem] rounded-full bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 opacity-20 blur-3xl" />
      </div>
    </main>
  )
}
