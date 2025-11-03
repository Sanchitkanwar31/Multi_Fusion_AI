import React, { useContext, useState } from "react";
import aimodelist from "@/shared/aimodelist";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader, Lock } from "lucide-react";
import { SelectLabel } from "@radix-ui/react-select";
import { DefaultModel } from "@/shared/aimodelprefer";
import { AimSelectedModelContext } from "@/context/AimSelectedModelContext";
import { updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { doc } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AiMultiModels() {
  const [aiModels, setAiModels] = useState(aimodelist);

  const { aiselectedmodel, setAiselectedmodel, messages, setMessages } =
    useContext(AimSelectedModelContext);

  // const { aiselectedmodel, setAiselectedmodel } = useContext(
  //   AimSelectedModelContext
  // );
  const { user } = useUser();

  // const onToglechange = (model, value) => {
  //   setAiModels((prevModels) =>
  //     prevModels.map((m) => (m.model === model ? { ...m, enable: value } : m))
  //   );
  // };

  const onToglechange = async (model, value) => {
    // Update UI toggle state
    setAiModels((prevModels) =>
      prevModels.map((m) => (m.model === model ? { ...m, enable: value } : m))
    );

    // Update context (and Firebase)
    if (value) {
      // If turning ON → restore model
      const updated = {
        ...aiselectedmodel,
        [model]: { modelId: DefaultModel[model]?.modelId },
      };
      setAiselectedmodel(updated);
      const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
      await updateDoc(docRef, { aiselectedmodelpref: updated });
    } else {
      // If turning OFF → remove model
      const updated = { ...aiselectedmodel };
      delete updated[model];
      setAiselectedmodel(updated);
      const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
      await updateDoc(docRef, { aiselectedmodelpref: updated });
    }
  };

  const handleSelectChange = async (parentmodel, selectedSubModel) => {
    const updatedModel = {
      ...aiselectedmodel,
      [parentmodel]: { modelId: selectedSubModel },
    };

    setAiselectedmodel(updatedModel);
    // setAiselectedmodel((prev) => ({
    //   ...prev,
    //   [parentmodel]: { modelId: selectedSubModel },
    // }));

    //update firebase
    const docRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    await updateDoc(docRef, { aiselectedmodelpref: updatedModel });
  };

  return (
    <div className="flex h-[75vh] justify-center border-b gap-3">
      {aiModels.map((model, index) => (
        <div
          key={index}
          className={`flex flex-col h-full overflow-auto border-r ${
            model.enable ? "flex-1 min-w-[400px]" : "w-[100px] flex-none"
          }`}
        >
          <div className="flex items-center w-full justify-center h-[50px] border-b">
            <div className="flex items-center p-2 gap-4">
              <Image
                src={model.icon}
                alt={model.model}
                width={40}
                height={40}
                className="rounded-full"
              />

              {model.enable && (
                <Select
                  onValueChange={(val) => handleSelectChange(model.model, val)}
                  defaultValue={aiselectedmodel?.[model.model]?.modelId}
                  disabled={model?.premium}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={
                        aiselectedmodel?.[model.model]?.modelId ||
                        DefaultModel[model.model]?.modelId
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectGroup className="px-3">
                      <SelectLabel className="text-sm text-gray-400">
                        Free
                      </SelectLabel>
                      {model.subModel.map(
                        (sub, subIndex) =>
                          !sub.premium && (
                            <SelectItem key={subIndex} value={sub.id}>
                              {sub.name}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>

                    <SelectGroup className="px-3">
                      <SelectLabel className="text-sm text-gray-400">
                        Premium
                      </SelectLabel>
                      {model.subModel.map(
                        (sub, subIndex) =>
                          sub.premium && (
                            <SelectItem
                              key={subIndex}
                              value={sub.name}
                              disabled={true}
                            >
                              {sub.name}{" "}
                              {sub.premium && (
                                <Lock className="inline-block ml-2 w-4 h-4" />
                              )}
                            </SelectItem>
                          )
                      )}
                    </SelectGroup>
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
            <div className="flex items-center justify-center h-full">
              <Button>
                <Lock /> Upgrade to premium
              </Button>
            </div>
          )}

          <div className="flex-1 p-2">
            <div className="flex-1 p-4 space-y-2">
              {messages[model.model]?.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-md ${
                    m.role === "user"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {m.role === "assistant" && (
                    <span className="text-sm text-gray-400">
                      {m.model ?? model.model}:
                    </span>
                  )}

                  <div className="flex gap-2 items-center">
                    {m.content === "loading" ? (
                      <>
                        <Loader className="animate-spin" />
                        <span>Thinking...</span>
                      </>
                    ) : (
                      <h2>
                        <Markdown remarkPlugins={[remarkGfm]}>{m.content}</Markdown></h2>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
