'use client';
import React from 'react';
import AppHeader from './_components/AppHeader';

function Provider({ children }) {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <div className="flex-shrink-0">
        <AppHeader />
      </div>
      <div className="flex-1 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export default Provider;