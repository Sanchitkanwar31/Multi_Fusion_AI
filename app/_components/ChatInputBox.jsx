"use client";
import { Ghost, Mic, Paperclip, Send } from 'lucide-react';
import React from 'react'
import { Button } from '@/components/ui/button';
import AiMultiModels from './AiMultiModels';


function ChatInputbox() {
  return (
    <div className='relative min-h-screen'>
        {/* below is for AI models list */}
        <div>
            <AiMultiModels />
        </div>
        {/* below is for Text box */}
        <div className='w-full justify-center flex fixed bottom-0'>
            <div className='w-full border rounded-xl shadow-md max-w-2xl p-4 dark:bg-gray-800'>
            <input type="text" placeholder='Type a message...' className='border-0 outline-none'/>
            <div className='mt-3 flex justify-between items-center'>
                <Button className='' variant={'ghost'} size="icon"> <Paperclip className='h-5 w-5' /> </Button>
                <div>
                    <Button className=''  variant={'ghost'} size="icon" > <Mic /> </Button>
                    <Button className='bg-blue-400'  size="icon" > <Send/> </Button>
                </div>
            </div>
            </div> 
        </div>
    </div>
  )
}

export default ChatInputbox