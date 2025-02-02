import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Button } from "../ui/button";

type Props = {
  handleOTPSubmit: (e: React.FormEvent<HTMLElement>) => void;
  setOtp: (otp: string) => void;
  otp: string;
  handleBack: () => void;
  isSubmitting?: boolean;
};

export default function OtpForm({
  handleOTPSubmit,
  setOtp,
  otp,
  handleBack,
  isSubmitting,
}: Props) {
  return (
    <>
      <form
        className="flex flex-col gap-3 justify-center"
        onSubmit={handleOTPSubmit}
      >
        <fieldset disabled={isSubmitting} className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground">
            Please enter the one time passcode from your authenticator app
          </p>
          <InputOTP maxLength={6} value={otp} onChange={setOtp} autoFocus>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button disabled={otp.length !== 6} type="submit">
            Verify And Activate
          </Button>
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        </fieldset>
      </form>
    </>
  );
}
