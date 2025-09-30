'use client'
import React, { useContext, useState } from "react";
import aiModelList from "../../shared/AiModelList";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, SelectGroup, SelectLabel
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader, Lock, Zap } from "lucide-react";
import { AiSelectedModelContext } from "@/context/AiModelListContext";
import { useUser } from "@clerk/nextjs";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "@/config/FirebaseDb";
import AiModelList from "../../shared/AiModelList";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'



function AiModel() {
  const { user } = useUser()
  const [aiModel, setAiModel] = useState(aiModelList)
  const { aiSelectedModels, setAiSelectedModels, messages, setMessages } =
    useContext(AiSelectedModelContext);
  // console.log("...",aiSelectedModels)

  function handleToggle(model, value) {
    const newAiModelList = aiModel.map((m) => (
      m.model == model ? { ...m, enable: value } : m
    ))
    setAiModel(newAiModelList)

    setAiSelectedModels((prev) => ({
      ...prev,
      [model]: {
        ...(prev?.[model] ?? {}),
        enable: value
      }
    }))
  }


 const onSelectValue = async (parentModel, value) => {
  setAiSelectedModels(prev => ({
    ...prev,
    [parentModel]: {
      ...prev[parentModel],
      modelId: value
    }
  }))
}


  return (
    <div className="h-full w-full overflow-hidden">
      <div className={`h-full w-full overflow-x-auto overflow-y-hidden scrollbar-hide`}>
        <div className="flex h-full" style={{ minWidth: 'max-content' }}>
          {aiModel.map((model, index) => (

            <div
              key={index}
              className={`flex-shrink-0 border-r shadow-sm bg-card hover:shadow-md transition-shadow duration-200 flex flex-col
                ${model.enable ? "flex-1 min-w-[400px] max-w-[400px]" : "w-[100px] flex-none"}
                `}
            >

              {/* Fixed Header */}
              <div className="p-2 h-[50px] border-b flex w-full justify-between items-center flex-shrink-0">
                <div className="flex min-w-[60%] items-center gap-2 h-full">
                  <Image src={model.icon} alt={model.model} width={24} height={24} className="w-6 h-6 rounded-md flex-shrink-0" />

                  {model.enable && (
                    <Select defaultValue={aiSelectedModels[model.model]?.modelId}
                      onValueChange={(value) => onSelectValue(model.model, value)}
                      disabled={model.premium}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={aiSelectedModels[model.model]?.modelId || "Select model"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Free</SelectLabel>
                          {model.subModel.map((version) => version.premium == false && (
                            <SelectItem key={version.id} value={version.id}>
                              {version.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        <SelectGroup>
                          <SelectLabel>Premium</SelectLabel>
                          {model.subModel.map((version) => version.premium == true && (
                            <SelectItem key={version.id} value={version.name}>
                              {version.name} <Lock />
                            </SelectItem>
                          ))}
                        </SelectGroup>

                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Switch checked={model.enable} onCheckedChange={(v) => handleToggle(model.model, v)} variant="icon" />
              </div>

              {/* Scrollable Content Area */}
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {/* Upgrade button for locked premium models */}
                {model.premium ? (
                  <div className="w-full h-full flex justify-center items-center p-4">
                    <Button variant="outline">
                      <Zap className="mr-2" /> Upgrade to Unlock
                    </Button>
                  </div>
                ) : model.enable ? ( // ✅ Only show messages if enabled
                  <div className="p-4 space-y-2">
                    {messages[model.model]?.map((m, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded-md ${m.role == "user"
                          ? "bg-blue-100 text-blue-900"
                          : "bg-gray-100 text-gray-900"
                          }`}
                      >
                        {m.role == "assistant" && (
                          <span className="text-sm text-gray-400">
                            {m.model ?? model.model}
                          </span>
                        )}
                        <div className="flex gap-3 items-center">
                          {m.content === "loading" && (
                            <>
                              <Loader className="animate-spin" />
                              <span>Thinking...</span>
                            </>
                          )}
                        </div>
                        {m.content !== "loading" &&
                      
                      <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown>
                      }
                      </div>
                    ))}
                  </div>
                ) : (
                  // Optional fallback if model is not enabled
                  <div className="w-full h-full flex justify-center items-center p-4 text-gray-400">
                    Model disabled
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AiModel;