"use client";

import { signIn } from "@/lib/auth-client";
const SignIn = () => {
  return (
    <button
      onClick={async () => {
        await signIn.social({
          provider: "google",
          callbackURL: "/",
        });
      }}
    >
      Continue with Google
    </button>
  );
};

export default SignIn;
