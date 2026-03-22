'use client';

//npm install react-markdown
//npm install @tailwindcss/typography

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

import { AppContents } from "./components/appcontents";
import { handleLLMTalk } from "./handler/handlellmtalk";
import { Message } from './models/message';
import { APPTITLE, APPVERSION, INITIAL_MESSAGES, MAX_HISTORY, ROLLTYPE } from './utils/constants';



export default function Home() {
  //チャットメッセージ
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  //入力テキスト
  const [inputValue, setInputValue] = useState('');
  //チャットメッセージの最下部
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  //入力テキストパーツ
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  //AI応答待ち
  const [inputbusy, setInputBusy] = useState<boolean>(false);

  // サブタイトル
  var subtitle = process.env.NEXT_PUBLIC_SUBTITLE;

  //チャットメッセージの最下部へ移動
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  //LLM処理
  const handlellmtalk = handleLLMTalk(
    (usertalk) => {
      //ユーザー送信
      if (!usertalk.trim())
        return; // 空送信防止

      setInputBusy(true);

      const newUserMsg: Message = { id: Date.now().toString(), role: ROLLTYPE.ROLE_USER, content: usertalk, createdAt: new Date() };
      setMessages(prev => [...prev, newUserMsg]);
      setInputValue('');
    },
    (llmresult) => {
      //AI応答
      const aiReply: Message = { id: (Date.now() + 1).toString(), role: ROLLTYPE.ROLE_ASSISTANT, content: llmresult, createdAt: new Date() };

      setMessages(prev => {
          const newArray = [...prev, aiReply];
          // 履歴数をリミットする
          return newArray.slice(-MAX_HISTORY);
        });

      setInputBusy(false);
    }
  );

  //キャラ画像
  const handleCharImage = (role: ROLLTYPE) => {
    switch(role) {
      case ROLLTYPE.ROLE_ASSISTANT:
        return '🖥️';
      case ROLLTYPE.ROLE_USER:
        return '👤';
      default:
        return '🗨️';
    }
  };

  return (
    <AppContents>
      {/* 画面構成の修正：h-screenを削除し、AppContentsに任せる */}
      <div className="flex flex-col h-full bg-gray-50 text-gray-800">
        <header className="p-4 border-b bg-white flex justify-between items-center shadow-sm shrink-0">
          <h1 className="text-lg font-bold">{APPTITLE} V.{APPVERSION} {subtitle}</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === ROLLTYPE.ROLE_USER ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${msg.role === ROLLTYPE.ROLE_USER ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 rounded-tl-none'}`}>
                  <div className="text-xs opacity-70 mb-1 font-bold">
                    {handleCharImage(msg.role)}
                    {msg.createdAt.toLocaleTimeString()}
                  </div>

                  <div className={`leading-relaxed ${msg.role === ROLLTYPE.ROLE_USER ? '' : 'prose prose-sm max-w-none dark:prose-invert'}`}>
                    {msg.role === ROLLTYPE.ROLE_USER ? (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    ) : (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    )}
                  </div>

                </div>
              </div>
            ))}
            <div ref={endOfMessagesRef} />
          </div>
        </main>

        <footer className="p-4 bg-white border-t shrink-0">
          {inputbusy ? (
            <div className="max-w-3xl mx-auto flex items-end gap-2">
              <Image src="/busy.gif" alt="icon" width={48} height={48} className="mb-8 ml-4" />
            </div>
          ) : (
            <div className="max-w-3xl mx-auto flex items-end gap-2">
              <textarea
                ref={textAreaRef}
                rows={3}
                value={inputValue}
                disabled={inputbusy}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  // Ctrl+Enter で送信
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handlellmtalk(inputValue, messages);
                  }
                  // 日本語変換中のEnterキーによる誤送信を防ぐ
                  if (e.key === 'Enter' && e.nativeEvent.isComposing) {
                    return;
                  }
                }}
                placeholder="メッセージを入力... (Ctrl+Enterで送信)"
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none max-h-48 overflow-y-auto transition-all"
              />
              <button
                disabled={inputbusy}
                onClick={() => handlellmtalk(inputValue, messages)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md h-[46px]"
              >
                👤送信
              </button>
            </div>
          )}
        </footer>
      </div>
    </AppContents>
  );
}
