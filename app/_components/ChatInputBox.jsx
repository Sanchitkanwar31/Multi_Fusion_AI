"use client";
import { Ghost, Mic, Paperclip, Send } from 'lucide-react';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AiMultiModels from './AiMultiModels';
import axios from 'axios';
import { useContext } from 'react';
import { AimSelectedModelContext } from '@/context/AimSelectedModelContext';
import{uuidv4} from 'uuid';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/config/FirebaseConfig';

//import { DefaultModel } from '@/shared/aimodelprefer';
// import { userdetailcontext } from '@/context/userdetailcontext';
// import { useUser } from '@clerk/nextjs';


function ChatInputbox() {
const [inputMessage, setInputMessage] = useState();
const { aiselectedmodel, setAiselectedmodel,messages, setMessages }= useContext(AimSelectedModelContext);
const [chatid,setchatid]= useState("");

useEffect(() => {setchatid(uuidv4())}, []); 

const handleSend = async () => {
    if (!inputMessage.trim()) return;

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
    Object.entries(aiselectedmodel).forEach(async ([parentModel, modelInfo]) => {
        if (!modelInfo.modelId) return;

        // Add loading placeholder before API call
        setMessages((prev) => ({
            ...prev,
            [parentModel]: [
                ...(prev[parentModel] ?? []),
                { role: "assistant", content: "loading", model: parentModel, loading: true },
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
            console.error(err);
            setMessages((prev) => ({
                ...prev,
                [parentModel]: [
                    ...(prev[parentModel] ?? []),
                    { role: "assistant", content: "⚠️ Error fetching response." },
                ],
            }));
        }
    });
};

//to save  messages

useEffect(() => {
    // console.log("Updated Messages:", messages);
    if(messages){
        savemessages();
    }
}, [messages]);

const savemessages = async () => {
 const docRef = doc(db, "chatHistory", chatid);
 await setDoc(docRef, {
    chatid: chatid,
    messages: messages,
    createdAt: new Date(),
 });
}

  return (
    <div className='relative min-h-screen'>
        {/* below is for AI models list */}
        <div>
            <AiMultiModels />
        </div>
        {/* below is for Text box */}
        <div className='w-full justify-center flex fixed bottom-0'>
            <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 dark:bg-gray-800'>
            <input type="text" placeholder='Type a message...' className='border-0 outline-none w-full' value={inputMessage}
            onChange ={(e)=>{ setInputMessage(e.target.value)}}
            />
            <div className='mt-3 flex justify-between items-center'>
                <Button className='' variant={'ghost'} size="icon"> <Paperclip className='h-5 w-5' /> </Button>
                <div>
                    <Button className=''  variant={'ghost'} size="icon" > <Mic /> </Button>
                    <Button className='bg-blue-400'  size="icon" onClick={handleSend} > <Send/> </Button>
                </div>
            </div>
            </div> 
        </div>
    </div>
  )
}

export default ChatInputbox