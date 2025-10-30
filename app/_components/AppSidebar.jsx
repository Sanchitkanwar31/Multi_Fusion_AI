"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Ghost, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

export function AppSidebar() {
 const {theme, setTheme} = useTheme();  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/file.svg"
              alt="ThinkSync Logo"
              width={40}
              height={60}
              className="w-40px h-40px"
            />
            <h1 className="text-2xl font-bold">ThinkSync</h1>
          </div>
          {theme == 'light' ? 
          <Button variant={Ghost}  onClick ={() => setTheme('dark')}> <Sun/> </Button>
          :<Button variant={Ghost}  onClick ={() => setTheme('light')}> <Moon/> </Button>
         }
        </div>
        <Button className="mt-7 w-full h-6" size="large"> + New Chat </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup> 
          <div className="p-2">
            <h2 className="font-bold text-lg flex">Chat</h2>
            <p className="text-sm text-gray-400">Sign in to begin chat</p> 
          </div>
        </SidebarGroup> 
        
      </SidebarContent>
      <SidebarFooter>
        <div className=" flex items-center gap-3 p-2">
          <Button className="text-lg p-2 w-full h-6">Sign In/Sign Up</Button>
        </div>
        <div>
          <p className="text-sm text-gray-400 pl-2">Made with ❤️ by ThinkSync</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
