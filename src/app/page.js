// 3. Fixed Page.jsx
'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import ChatInputBox from './_components/ChatInputBox';

function Page() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="h-full w-full overflow-hidden">
      <ChatInputBox />
    </div>
  );
}

export default Page;