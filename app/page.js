"use client";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import { useTheme } from "next-themes";
export default function Home() {
  const {setTheme} = useTheme();   
  return (
    <div>
     <h2>hello</h2>
     <Button>Click Me</Button>
     <Button onClick ={() => setTheme('dark')}>Dark</Button>
     <Button onClick ={() => setTheme('light')}>Light</Button>
  
    </div>
  );
}
