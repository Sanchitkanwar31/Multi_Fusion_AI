import React from 'react'
import { Progress } from '@/components/ui/progress';

export default function UsageCredit() {
  return (
    <div className='p-3 border rounded-2xl gap-1 flex flex-col'>
      <h2>Free Plan</h2>
      <p>0/5 message Used</p>
      <Progress value={33} />
   </div>
  )
}
