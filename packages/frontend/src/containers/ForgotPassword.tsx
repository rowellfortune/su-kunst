// src/components/auth/ForgotPassword.tsx
import { useState } from "react";
import { Auth } from "aws-amplify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp"

export default function ForgotPassword() {
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  // Step 1: send the code
  async function handleRequestCode() {
    try {
      await Auth.forgotPassword(email);
      setMessage("✅ Code sent! Check your email.");
      setStep("reset");
    } catch (err) {
      setMessage((err as Error).message);
    }
  }

  // Step 2: submit code + new password
  async function handleResetPassword() {
    try {
      await Auth.forgotPasswordSubmit(email, code, newPassword);
      setMessage("🎉 Password reset! You can now sign in.");
    } catch (err) {
      setMessage((err as Error).message);
    }
  }

  return (
    <div className="max-w-md mx-auto brounded-lg">
      {step === "request" ? (
        <>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Forgot Password</CardTitle>
              <CardDescription>
               Type the email you registered with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <Button className="w-full my-3" onClick={handleRequestCode}>Send Reset Code</Button>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-semibold">Reset Password</h2>
          <Input
            placeholder="Verification code"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <Input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <Button onClick={handleResetPassword}>Reset Password</Button>
        </>
      )}
      {message && <p className="mt-2 text-sm text-red-500">{message}</p>}
    </div>
  );
}
