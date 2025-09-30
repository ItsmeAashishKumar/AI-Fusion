'use client';
import React, { useState, useRef, useEffect, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Paperclip, Send } from 'lucide-react';
import AiModel from '../_components/AiModel';
import { AiSelectedModelContext } from '@/context/AiModelListContext';
import axios from 'axios';
import { doc, getDoc, setDoc } from "firebase/firestore"
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/config/FirebaseDb';
import { useUser } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';

function ChatInputBox() {
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef(null);
  const [chatId, setChatId] = useState()
  const { user } = useUser()
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } =
    useContext(AiSelectedModelContext);

  const params = useSearchParams()
  // console.log("params", params.get('chatId'))

  useEffect(() => {
  const id = params.get("chatId") // use different name, not chatId
  if (id) {
    setChatId(id)
    getMessages(id)   // pass id explicitly
  } else {
    const newId = uuidv4()
    setMessages([])
    setChatId(newId)
  }
}, [params])

const getMessages = async (id) => {
  const docRef = doc(db, "chatHistory", id) 
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const docData = docSnap.data()
    setMessages(docData.messages || [])
  } else {
    setMessages([]) // no doc found
  }
}



  const handleSend = async () => {
    if (!userInput.trim()) return;


    // 1. Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiSelectedModels).forEach((modelKey) => {
        if (aiSelectedModels[modelKey].enable && aiSelectedModels[modelKey].modelId) {
          updated[modelKey] = [
            ...(updated[modelKey] ?? []),
            { role: "user", content: userInput },
          ];
          // console.log(`Added user message to ${modelKey}`);
        }
      });
      return updated;
    });

    const currentInput = userInput; // capture before reset
    setUserInput("");

    // 2. Fetch response from each enabled model
    Object.entries(aiSelectedModels).forEach(async ([parentModel, modelInfo]) => {
      if (!modelInfo.modelId || !modelInfo.enable) {
        // console.log(`Skipping ${parentModel}: enabled=${modelInfo.enable}, modelId=${modelInfo.modelId}`);
        return;
      }

      // console.log(`Fetching response from ${parentModel} with modelId: ${modelInfo.modelId}`);

      // Add loading placeholder before API call
      setMessages((prev) => ({
        ...prev,
        [parentModel]: [
          ...(prev[parentModel] ?? []),
          {
            role: "assistant",
            content: "loading",
            model: parentModel,
            loading: true,
          },
        ],
      }));

      try {
        const result = await axios.post("/api/ai_model_api", {
          model: modelInfo.modelId,
          msg: [{ role: "user", content: currentInput }],
          parentModel,
        });

        // console.log(`Response from ${parentModel}:`, result.data);

        const { aiResponse, model } = result.data;

        // 3. Add AI response to that model's messages
        setMessages((prev) => {
          const updated = [...(prev[parentModel] ?? [])];
          const loadingIndex = updated.findIndex((m) => m.loading);

          if (loadingIndex !== -1) {
            updated[loadingIndex] = {
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            };
          } else {
            // fallback if no loading msg found
            updated.push({
              role: "assistant",
              content: aiResponse,
              model,
              loading: false,
            });
          }

          return { ...prev, [parentModel]: updated };
        });
      } catch (err) {
        console.error(`Error fetching from ${parentModel}:`, err);
        setMessages((prev) => {
          const updated = [...(prev[parentModel] ?? [])];
          const loadingIndex = updated.findIndex((m) => m.loading);

          if (loadingIndex !== -1) {
            updated[loadingIndex] = {
              role: "assistant",
              content: "⚠️ Error fetching response.",
              loading: false,
            };
          } else {
            updated.push({
              role: "assistant",
              content: "⚠️ Error fetching response.",
            });
          }

          return { ...prev, [parentModel]: updated };
        });
      }
    });
  };

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // console.log("Current messages:", messages);

  // Uncomment when you want to enable auto-save
  useEffect(() => {
    if (messages && Object.keys(messages).length > 0) {
      SaveMessages()
    }
  }, [messages])

  const SaveMessages = async () => {
    if (!chatId || !user) return;

    const docRef = doc(db, 'chatHistory', chatId)
    await setDoc(docRef, {  // ✅ Fixed: comma was wrong
      chatId: chatId,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      messages: messages,
      lastUpdated: Date.now()
    })
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Models Section */}
      <div className="flex-shrink-0 h-[75vh] border-b bg-background overflow-hidden">
        <AiModel />
      </div>

      {/* Chat Input Section */}
      <div className="flex-shrink-0 border-t bg-background p-4">
        <div className="max-w-2xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <div className="border rounded-2xl shadow-sm bg-card overflow-hidden">
              <div className="flex items-end gap-2 p-3">
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  className="flex-shrink-0"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <div className="flex-1 min-w-0">
                  <input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full resize-none outline-none bg-transparent placeholder:text-muted-foreground min-h-[20px] max-h-32 py-1"
                    placeholder="Ask me anything ..."
                  />
                </div>

                <div className="flex gap-1 flex-shrink-0">
                  <Button variant="ghost" size="icon" type="button">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button size="icon" type="submit" disabled={!userInput.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default ChatInputBox;