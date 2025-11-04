"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Ghost, Moon, Sun, User2Icon, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import UsageCredit from "./UsageCredit";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/FirebaseConfig";
import moment from "moment";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useContext } from "react";
import { AimSelectedModelContext } from "@/context/AimSelectedModelContext";
import Pricingmodel from "./Pricingmodel";
import { SignOutButton } from "@clerk/nextjs";

export function AppSidebar() {
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const [chatHistory, setChatHistory] = useState([]);
  const [freemsgcount, setfreemsgcount] = useState(0);
  const { aiselectedmodel, setAiselectedmodel, messages, setMessages } =
    useContext(AimSelectedModelContext);

  const { has } = useAuth();

  // const paidUser = has({ plan: "unlimited_plan" });

  useEffect(() => {
    GetRemaingMessages();
  }, [messages]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      getChatHistory();
      GetRemaingMessages();
    }
  }, [user]);

  const getChatHistory = async () => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        console.log("User not loaded yet");
        return;
      }
      const q = query(
        collection(db, "chatHistory"),
        where("email", "==", user?.primaryEmailAddress?.emailAddress)
      );
      const querySnapshot = await getDocs(q);
      const chats = [];
      querySnapshot.forEach((doc) => {
        chats.push({ id: doc.id, ...doc.data() });

        setChatHistory((prev) => [...prev, doc.data()]);
        console.log("Chat History Doc:", doc.id, "=>", doc.data());
      });
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Get last user message summary
  const getLastUserMessage = (chat) => {
    if (!chat?.messages) return { message: "No messages yet", lastMsgDate: "" };

    const allMessages = Object.values(chat.messages).flat();
    const userMessages = allMessages.filter((msg) => msg.role === "user");
    const lastMessage =
      userMessages.length > 0
        ? userMessages[userMessages.length - 1].content
        : "No user messages";

    const lastUpdated = chat.lastupdated || Date.now();
    const formattedDate = moment(lastUpdated).fromNow();

    return {
      chatId: chat.chatId,
      message: lastMessage,
      lastMsgDate: formattedDate,
    };
  };

  //to see credit left
  const GetRemaingMessages = async () => {
    const result = await axios.post("/api/user-remaining-credit");
    console.log("User data:", result?.data);
    setfreemsgcount(result?.data?.remainingtoken);
  };

  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeader>
        <div className="p-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/file.svg"
              alt="ThinkSync Logo"
              width={40}
              height={60}
              className="w-40 h-10"
            />
            <h1 className="text-2xl font-bold">ThinkSync</h1>
          </div>
          {theme === "light" ? (
            <Button variant="ghost" onClick={() => setTheme("dark")}>
              <Sun />
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => setTheme("light")}>
              <Moon />
            </Button>
          )}
        </div>

        {user ? (
          <>
            <Link href={"/"}>
              <Button className="mt-7 w-full h-6" size="lg">
                + New Chat
              </Button>
            </Link>

            {/* <Button className="mt-7 w-full h-6" size="lg">
              + New Chat
            </Button> */}
          </>
        ) : (
          <SignInButton mode="modal">
            <Button className="text-lg p-2 w-full h-6">
              Sign In / Sign Up
            </Button>
          </SignInButton>
        )}
      </SidebarHeader>

      {/* CHAT HISTORY */}
      <SidebarContent>
        <SidebarGroup>
          <div className="p-2">
            <h2 className="font-bold text-lg">Chat</h2>
            {!user && (
              <p className="text-sm text-gray-400">Sign in to begin chat</p>
            )}

            {chatHistory.map((chat, id) => {
              const last = getLastUserMessage(chat);
              return (
                <Link href={"?chatId=" + chat.chatId} key={chat.id}>
                  <div className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition">
                    <h2 className="text-sm text-gray-400">
                      {last.lastMsgDate}
                    </h2>
                    <h2 className="text-lg line-clamp-1">{last.message}</h2>
                  </div>
                  <hr className="my-0.5" />
                </Link>
              );
            })}
          </div>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        {/* <UsageCredit remainingtoken={freemsgcount} /> */}
        <div className="flex flex-col items-center gap-3 p-2">
          {!user ? (
            <SignInButton mode="modal">
              <Button className="text-lg p-2 w-full h-6">
                Sign In / Sign Up
              </Button>
            </SignInButton>
          ) : (
            <div className="w-full">
              {!has({ plan: "unlimited_plan" }) && (
                <div>
                  <UsageCredit remainingtoken={freemsgcount} />
                  <Pricingmodel>
                    <Button className="w-full mb-2">
                      <Zap className="mr-2" /> Upgrade Plan
                    </Button>
                  </Pricingmodel>
                </div>
              )}

              <SignOutButton afterSignOutUrl="/">
                <Button className="flex w-full" variant="ghost">
                  <User2Icon className="mr-2" />
                  <h2>Sign Out</h2>
                </Button>
              </SignOutButton>

              {/* <Button className="flex w-full" variant="ghost">
                <User2Icon className="mr-2" /> <h2>Settings</h2>
              </Button> */}
            </div>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-400 pl-2">
            Made with ❤️ by ThinkSync
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
