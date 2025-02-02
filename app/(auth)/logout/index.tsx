"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { userLogout } from "./action";
import { showToast } from "@/components/common/showtoast";
import { useToast } from "@/hooks/use-toast";

export default function LogoutBtn() {
  const router = useRouter();
  const toast = useToast();

  const handleLogOut = async () => {
    const response = await userLogout();
    if (!response.error) {
      showToast(toast, { ...response, message: String(response.message) });
      router.push("/login");
    } else {
      showToast(toast, { ...response, message: String(response.message) });
    }
  };

  return <Button onClick={handleLogOut}>Logout</Button>;
}
