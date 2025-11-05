"use client";
import { Ghost, Mic, Paperclip, Send } from "lucide-react";
import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {AiMultiModels} from "./AiMultiModels";
import axios from "axios";
import { useContext } from "react";
import { AimSelectedModelContext } from "@/context/AimSelectedModelContext";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import { db } from "@/config/FirebaseConfig";
import { useSearchParams } from "next/navigation";
import { useUser,useAuth } from "@clerk/nextjs";

function ChatInputbox() {
  const [inputMessage, setInputMessage] = useState();
  const { user } = useUser();
  const { aiselectedmodel, setAiselectedmodel, messages, setMessages } =useContext(AimSelectedModelContext);
  const [chatId, setChatId] = useState("");

  const {has}=useAuth();
//   const paidUser = has({ plan: 'unlimited_plan' });

  const params = useSearchParams();

  useEffect(() => {
    const chtIdFromParams = params.get("chatId");
    if (params.get("chatId")) {
      setChatId(params.get("chatId"));
      GetMessages(chtIdFromParams);
    } else {
      setChatId(uuidv4());
    }
  }, [params]);

  const handleSend = async () => {
    
    if (!user) {
    toast.error("Please sign in to start chatting");
    return;
    }

    if (!inputMessage || !inputMessage.trim()) {
    toast.warning("Please type a message before sending");
    return;
  }

    //deduct and check limit
    if(!has({ plan: "unlimited_plan" })){
    const result=await axios.post('/api/user-remaining-credit',{
        token:1
    });

    console.log(result);
    const remainingtoken = result?.data?.remainingtoken;
    
    if(remainingtoken <=0){
        console.log("Limit Exceed");
        toast.error('Maximum Daily Limit Exceed')
        return ;
    }}


    // 1️⃣ Add user message to all enabled models
    setMessages((prev) => {
      const updated = { ...prev };
      Object.keys(aiselectedmodel).forEach((modelKey) => {
        updated[modelKey] = [
          ...(updated[modelKey] ?? []),
          { role: "user", content: inputMessage },
        ];
      });
      return updated;
    });

    const currentInput = inputMessage; // capture before reset
    setInputMessage("");

    // 2️⃣ Fetch response from each enabled model
    Object.entries(aiselectedmodel).forEach(
      async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId) return;

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
          const result = await axios.post("/api/ai-multi-model", {
            model: modelInfo.modelId,
            msg: [{ role: "user", content: currentInput }],
            parentModel,
          });

          const { aiResponse, model } = result.data;

          // 3️⃣ Add AI response to that model’s messages
          setMessages((prev) => {
            const updated = [...(prev[parentModel] ?? [])];
            const loadingIndex = updated.findIndex((m) => m.loading);

            if (loadingIndex !== -1) {
              updated[loadingIndex] = {
                role: "assistant",
                content: aiResponse ?? "No response",
                model: model ?? parentModel ?? "unknown",
                loading: false,
              };
            } else {
              // fallback if no loading msg found
              updated.push({
                role: "assistant",
                content: aiResponse ?? "No response",
                model: model ?? parentModel ?? "unknown",
                loading: false,
              });
            }
            const newMessages = { ...prev, [parentModel]: updated };
            savemessages(newMessages); // save after each response
            return { ...prev, [parentModel]: updated };
          });
        } catch (err) {
          console.error(err);
          setMessages((prev) => ({
            ...prev,
            [parentModel]: [
              ...(prev[parentModel] ?? []),
              { role: "assistant", content: "⚠️ Error fetching response." },
            ],
          }));
        }
      }
    );
  };

  //to save  messages

  useEffect(() => {
    // console.log("Updated Messages:", messages);
    if (messages) {
      savemessages();
    }
  }, [messages]);

  const savemessages = async () => {
    try {
      const docRef = doc(db, "chatHistory", chatId);
      await setDoc(docRef, {
        chatId: chatId,
        email: user?.primaryEmailAddress?.emailAddress,
        messages: messages,
        createdAt: new Date(),
      });
      console.log("✅ Saved to Firestore:", chatId);
    } catch (error) {
      console.error("Firestore Save Error:", error);
    }
  };

  //to get messages from history
  const GetMessages = async () => {
    try {
      if (!chatId) {
        console.warn(" No chatId provided — skipping Firestore fetch");
        return;
      }

      const docRef = doc(db, "chatHistory", chatId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.warn(" No document found for chatId:", chatId);
        setMessages([]); // set empty array so UI doesn’t break
        return;
      }

      const docData = docSnap.data();

      if (!docData?.messages) {
        console.warn("Document found but no 'messages' field:", docData);
        setMessages([]);
        return;
      }

      setMessages(docData.messages);
      console.log("Fetched Messages:", docData.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* below is for AI models list */}
      <div>
        <AiMultiModels />
      </div>
      {/* below is for Text box */}
      <div className="w-full justify-center flex fixed bottom-0">
        <div className="w-full border rounded-xl shadow-md max-w-2xl p-4 dark:bg-gray-800">
          <input
            type="text"
            placeholder="Type a message..."
            className="border-0 outline-none w-full"
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
            }}
          />
          <div className="mt-3 flex justify-between items-center">
            <Button className="" variant={"ghost"} size="icon">
              {" "}
              <Paperclip className="h-5 w-5" />{" "}
            </Button>
            <div>
              <Button className="" variant={"ghost"} size="icon">
                {" "}
                <Mic />{" "}
              </Button>
              <Button className="bg-blue-400" size="icon" onClick={handleSend}>
                {" "}
                <Send />{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatInputbox;
