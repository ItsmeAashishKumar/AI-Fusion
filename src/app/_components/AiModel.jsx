'use client'
import React, { useContext, useState } from "react";
import aiModelList from "../../shared/AiModelList";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,SelectGroup,SelectLabel
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Lock, Zap } from "lucide-react";
import { AiSelectedModelContext } from "@/context/AiModelListContext";
import { useUser } from "@clerk/nextjs";
import { updateDoc,doc } from "firebase/firestore";
import { db } from "@/config/FirebaseDb";




function AiModel() {
  const {user}=useUser()
  const [aiModel, setAiModel] = useState(aiModelList)
  const {aiSelectedModels, setAiSelectedModels}=useContext(AiSelectedModelContext)
  // console.log("...",aiSelectedModels)

  function handleToggle(model, value) {
    const newAiModelList = aiModel.map((m) => (
      m.model == model ? { ...m, enable: value } : m
    ))
    setAiModel(newAiModelList)
  }


  const onSelectValue=async(parentModel,value)=>{
    setAiSelectedModels(prev=>({
      ...prev,
    [parentModel]:{
      modelId:value
    }
    }))
    const docRef=doc(db,"users",user?.primaryEmailAddress?.emailAddress)
    await updateDoc(docRef,{
      selectedModelPref:aiSelectedModels
    })
  }


  return (
    <div className="h-full w-full  overflow-hidden">
      <div className={`h-full w-full overflow-x-auto overflow-y-hidden scrollbar-hide`}>
        <div className="flex h-full " style={{ minWidth: 'max-content' }}>
          {aiModel.map((model, index) => (

            <div
              key={index}
              className={`flex-shrink-0 border-r shadow-sm bg-card hover:shadow-md transition-shadow duration-200
                ${model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"}
                `}
            >

              <div className="p-2 h-[50px] border-b flex w-full justify-between items-center">
                <div className="flex min-w-[60%] items-center gap-2 h-full">
                  <Image src={model.icon} alt={model.model} width={24} height={24} className="w-6 h-6 rounded-md flex-shrink-0" />

                  {model.enable && (
                    <Select defaultValue={aiSelectedModels[model.model]?.modelId}  
                    onValueChange={(value)=>onSelectValue(model.model,value)}
                    disabled={model.premium}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={aiSelectedModels[model.model]?.modelId || "Select model"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                        <SelectLabel>Free</SelectLabel>
                          {model.subModel.map((version) => version.premium==false && (
                            <SelectItem key={version. id} value={version.id}>
                              {version.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                         <SelectGroup>
                        <SelectLabel>Premium</SelectLabel>
                          {model.subModel.map((version) => version.premium==true && (
                            <SelectItem key={version.id} value={version.name}>
                              {version.name} <Lock/>
                            </SelectItem>
                          ))}
                        </SelectGroup>

                      </SelectContent>
                    </Select>
                  )}
                </div>

                <Switch checked={model.enable} onCheckedChange={(v) => handleToggle(model.model, v)} variant="icon" />
              </div>

              {/* Upgrade button for locked premium models */}
              {model.premium && (
                <div className="w-full h-full flex justify-center items-center p-4">
                  <Button variant="outline">
                    <Zap className="mr-2" /> Upgrade to Unlock
                  </Button>
                </div>
              )}


            </div>




          ))}
        </div>
      </div>
    </div>
  );
}

export default AiModel;
