"use client";
import { signOut } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";

const handleLogout = async () => {
  await signOut();
};

const Logout = () => {
  return (
    <Button className="flex border rounded-lg " onClick={handleLogout}>
      Logout <LogOutIcon />
    </Button>
  );
};

export default Logout;
