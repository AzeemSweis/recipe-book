"use client";

import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
      <SignUp 
        routing="path" 
        path="/sign-up" 
        signInUrl="/sign-in" 
        afterSignUpUrl="/" 
      />
    </div>
  );
}