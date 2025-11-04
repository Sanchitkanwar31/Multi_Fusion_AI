import React from 'react'
import { Progress } from '@/components/ui/progress';

export default function UsageCredit({remainingtoken}) {
  return (
    <div className='p-3 border rounded-2xl gap-1 flex flex-col'>
      <h2>Free Plan</h2>
      <p className='text-gray-400'>{5-remainingtoken}/5 message used</p>
      <Progress value={100-((5-remainingtoken)/5)*100} />
   </div>
  )
}
