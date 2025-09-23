import React, { useState } from "react";
import aiModelList from "../../shared/AiModelList";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

function AiModel() {
  const [aiModel, setAiModel] = useState(aiModelList)

  function handleToggle(model, value) {
    const newAiModelList = aiModel.map((m) => (
      m.model == model ? { ...m, enable: value } : m
    ))
    setAiModel(newAiModelList)
  }

  return (
    <div className="h-full w-full  overflow-hidden">
      <div className={`h-full w-full overflow-x-auto overflow-y-hidden scrollbar-hide`}>
        <div className="flex h-full " style={{ minWidth: 'max-content' }}>
          {aiModel.map((aiModel, index) => (
            <div
              key={index}
              className={`flex-shrink-0 border-r shadow-sm bg-card hover:shadow-md transition-shadow duration-200
                ${aiModel.enable?"flex-1 min-w-[400px]":"w-[100px] flex-none"}
                `}
            >

              <div className="p-2 h-[50px] border-b flex w-full  justify-between items-center ">
                <div className="flex min-w-[60%] items-center  gap-2 h-full">
                  <div className="flex items-center gap-3">
                    <Image
                      src={aiModel.icon}
                      alt={aiModel.model}
                      width={24}
                      height={24}
                      className="w-6 h-6 rounded-md flex-shrink-0"
                    />

                  </div>

                  {aiModel.enable &&
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={aiModel.subModel[0]?.name || "Select model"}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {aiModel.subModel.map((version) => (
                          <SelectItem key={version.id} value={version.name}>
                            {version.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  }

                </div>
                <div className=""
                ><Switch
                    checked={aiModel.enable}
                    onCheckedChange={(v) => handleToggle(aiModel.model, v)}
                    variant={'icon'} />
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AiModel;
