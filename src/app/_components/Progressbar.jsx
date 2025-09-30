import React from "react";
import { Progress } from "@/components/ui/progress";

function Progressbar({remainingToken}) {
  return (
    <div className="w-full">
      <div className="w-full px-2 pb-2 flex flex-col border rounded-md gap-2">
        <div>
          <h2 className="font-bold text-black dark:text-white">Free Plan</h2>
          <h2 className="text-gray-600 dark:text-gray-400">{remainingToken}/5 Credits</h2>
        </div>

        <Progress value={100-((5-remainingToken)/5)*100} />
      </div>
    </div>
  );
}

export default Progressbar;
