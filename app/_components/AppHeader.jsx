import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import React from "react";
import { SignInButton } from "@clerk/nextjs";

function AppHeader() {
  return (
    <div className="w-full shadow p-3 flex items-center justify-between">
      <SidebarTrigger />
      {/* AppHeader */}
      <SignInButton mode="modal">
        <Button>Sign In</Button>
      </SignInButton>
    </div>
  );
}

export default AppHeader;
