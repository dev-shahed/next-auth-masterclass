"use client";

import { Button } from "@/components/ui/button";
import React, { FormEvent, useState } from "react";
import { showToast } from "@/components/common/showtoast";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { activate2fa, disable2fa, get2faSecret } from "./action";
import OtpForm from "@/components/common/otp-form";

type Props = {
  twoFactorAuth: boolean;
};

export default function TwoFactorAuth({ twoFactorAuth }: Props) {
  const toast = useToast();
  const [isActivated, setIsActivated] = useState(twoFactorAuth);
  const [step, setStep] = useState(1);
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");

  const handleEnable2FA = async () => {
    const response = await get2faSecret();
    if (response?.error) {
      showToast(toast, response);
      return;
    }
    if ("twoFactorSecret" in response) {
      setSecret(response.twoFactorSecret as string);
    }
    setStep(2);
  };

  const handleOTPSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault();
    const response = await activate2fa(otp);
    showToast(toast, response);
    if (response?.error) return;
    if (!response?.error) {
      setIsActivated(true);
      setOtp("");
    }
  };

  const handleDisable2FA = async () => {
    const response = await disable2fa();
    showToast(toast, response);
    if (response?.error) return;
    if (!response?.error) {
      setIsActivated(false);
    }
    setStep(1);
  };

  const handleBack = () => {
    setStep(2);
  };

  console.log("step", step);

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
              <Button className="w-full my-2" onClick={() => setStep(3)}>
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
          {step === 3 && (
            <OtpForm
              handleOTPSubmit={handleOTPSubmit}
              setOtp={setOtp}
              otp={otp}
              handleBack={handleBack}
            />
          )}
        </div>
      )}
      {isActivated && (
        <div className="flex flex-col gap-3">
          <p>Two Factor Authentication is Activated</p>
          <Button variant="destructive" onClick={handleDisable2FA}>
            Disable Two Factor Authentication
          </Button>
        </div>
      )}
    </>
  );
}
