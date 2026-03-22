'use client';

import Image from 'next/image';

export function AppContents({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className="h-screen w-full bg-zinc-50 dark:bg-black flex justify-center overflow-hidden">
            <main className="flex h-full w-full max-w-4xl flex-col bg-white dark:bg-zinc-900 shadow-xl">

                {/* チャットの中身（Homeコンポーネント） */}
                {/* flex-1 を指定することで、余った高さをすべて使い、フッターを下に押し出します */}
                <div className="flex-1 min-h-0 flex flex-col">
                    {children}
                </div>

                {/* フッター：ここを独立した要素として配置 */}
                <footer className="flex items-center justify-center py-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800 text-gray-400 text-[10px] shrink-0">
                    Designed By dangerouswoo.
                </footer>
            </main>
        </div>
    )
}
