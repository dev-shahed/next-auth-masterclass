"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { get2faSecret } from "./action";
import { showToast } from "@/components/ui/showtoast";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";

type Props = {
  twoFactorAuth: boolean;
};
export default function TwoFactorAuth({ twoFactorAuth }: Props) {
  const toast = useToast();
  const [isActivated, setIsActivated] = useState(twoFactorAuth);
  console.log(isActivated);
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState("");
  const handleEnable2FA = async () => {
    const response = await get2faSecret();
    if ("error" in response) {
      showToast(
        toast,
        { ...response, message: String(response.message) },
        "success"
      );
    }
    setStep(2);
    if ("twoFactorSecret" in response) {
      setSecret(response.twoFactorSecret as string);
    }
  };

  return (
    <>
      {!isActivated && (
        <div>
          {step === 1 && (
            <Button onClick={handleEnable2FA}>
              Enable Two-Factor Authentication
            </Button>
          )}
          {step === 2 && (
            <div>
              <p className="text-xs text-muted-foreground py-2">
                Scan the QR code below with your authenticator app to activate
                2FA
              </p>
              <QRCodeSVG value={secret} size={200} />
              <Button
                className="w-full my-2"
                onClick={() => setIsActivated(true)}
              >
                I have scanned
              </Button>
              <Button
                variant="outline"
                className="w-full my-2"
                onClick={() => setStep(1)}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
