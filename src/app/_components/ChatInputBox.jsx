// 4. Fixed ChatInputBox.jsx
'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import AiModel from '../_components/AiModel';

function ChatInputBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newUserMessage = { id: Date.now(), text: message, isUser: true };
      setMessages((prev) => [...prev, newUserMessage]);

      setTimeout(() => {
        const aiResponse = { id: Date.now() + 1, text: `AI: ${message}`, isUser: false };
        setMessages((prev) => [...prev, aiResponse]);
      }, 500);

      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="flex-shrink-0 h-[75vh] border-b bg-background overflow-hidden">
        <AiModel />
      </div>
      <div className="flex-shrink-0 border-t bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="w-full">
            <div className="border rounded-2xl shadow-sm bg-card overflow-hidden">
              <div className="flex items-end gap-2 p-3">
                <Button variant="ghost" size="icon" type="button" className="flex-shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>

                <div className="flex-1 min-w-0">
                  <textarea
                    value={message}
                    onChange={handleInputChange}
                    className="w-full resize-none outline-none bg-transparent placeholder:text-muted-foreground min-h-[20px] max-h-32 py-1"
                    placeholder="Ask me anything ..."
                    rows={1}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" type="button">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    type="submit"
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;