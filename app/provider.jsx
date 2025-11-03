"use client";
import React, { useEffect } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AppSidebar } from "./_components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppHeader from "./_components/AppHeader";
// import { SidebarTrigger } from '@/components/ui/sidebar-trigger'
import { useUser } from "@clerk/nextjs";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../config/FirebaseConfig";
import { AimSelectedModelContext } from "@/context/AimSelectedModelContext";
import { userdetailcontext } from "@/context/userdetailcontext";
import { useState } from "react";
import { DefaultModel } from "@/shared/aimodelprefer";

function Provider({ children, ...props }) {
  const { user } = useUser();
  const [aiselectedmodel, setAiselectedmodel] = useState({ DefaultModel });
  const [userDetail, setUserDetail] = useState();

  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (user) {
      CreateUser();
    }
  }, [user]);

  const CreateUser = async () => {
    const userRef = doc(db, "users", user?.primaryEmailAddress?.emailAddress);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      console.log("Existing User");
      const userData = userSnap.data();
      setAiselectedmodel(userData?.aiselectedmodelpref??DefaultModel);
      setUserDetail(userData);
      return;
    } 
    else {
      const userData = {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: new Date(),
        remaingmsg: 5, // initial free messages
        plan: "free",
        credits: 1000, //paid user
      };

      await setDoc(userRef, userData);
      console.log("New User Created");
      setUserDetail(userData);
    }

    //if not user exist create new user
  };

  return (
    <NextThemesProvider
      {...props}
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <userdetailcontext.Provider value={{ userDetail, setUserDetail}}>
        <AimSelectedModelContext.Provider
          value={{ aiselectedmodel, setAiselectedmodel,messages, setMessages }}
        >
          <SidebarProvider>
            <AppSidebar />

            <div className="w-full">
              <AppHeader />
              {children}
            </div>
          </SidebarProvider>
        </AimSelectedModelContext.Provider>
      </userdetailcontext.Provider>
    </NextThemesProvider>
  );
}

export default Provider;
