// import React from "react";
// import aimodelist from "@/shared/aimodelist";
// import Image from "next/image";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { useState } from "react";

// export default function AiMultiModels() {
//   // const [aimodelist, setAImodelist] = useState(aimodelist);
//   const [aimodelist, setAImodelist] = useState(aimodelist);
//   return (
//     <div className="flex flex-1 h-[75vh] border-b">
//       {aimodelist.map((model, index) => (
//         <div>
//           <div>
//             <Image
//               src={model.icon}
//               alt={model.model}
//               width={24}
//               height={24}
//               className="rounded-full"
//             />

//             <Select>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder={model.subModel[0].name}/>
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="light">Light</SelectItem>
//                 <SelectItem value="dark">Dark</SelectItem>
//                 <SelectItem value="system">System</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

import React, { useState } from "react";
import aimodelist from "@/shared/aimodelist";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export default function AiMultiModels() {
  const [aiModels, setAiModels] = useState(aimodelist);
  const onToglechange = (model, value) => {
    setAiModels((prevModels) =>
      prevModels.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );
  };
  return (
    <div className="flex h-[75vh] justify-center border-b gap-3 ">
      {aiModels.map((model, index) => (
        <div
          className={`flex flex-col h-full overflow-auto border-r ${
            model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"
          }`}
        >
          <div
            key={index}
            className="flex items-center w-full justify-center h-[50px] border-b "
          >
            <div className="flex items-center p-2 gap-4">
              <Image
                src={model.icon}
                alt={model.model}
                width={40}
                height={40}
                className="rounded-full"
              />

              {model.enable && (
                <Select>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={model.subModel[0].name} />
                  </SelectTrigger>

                  <SelectContent>
                    {model.subModel.map((sub, subIndex) => (
                      <SelectItem key={subIndex} value={sub.name}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div>
              <Switch
                checked={model.enable}
                onCheckedChange={(v) => onToglechange(model.model, v)}
              />
            </div>
          </div>
          {model.premium && model.enable && (
            <div className=" flex items-center justify-center h-full">
              <Button>
                <Lock /> Upgrade to premium
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
