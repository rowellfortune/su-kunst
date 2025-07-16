// src/components/UserLogin.tsx
"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Auth } from "aws-amplify";
import { onError } from "@/lib/errorLib";
import { useAppContext } from "@/lib/contextLib";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SignUpValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface ConfirmValues {
  confirmationCode: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const { userHasAuthenticated, setUser  } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // 1) Sign-up form
  const signupForm = useForm<SignUpValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    },
    mode: "onChange",
  });

  // 2) Confirmation form
  const confirmForm = useForm<ConfirmValues>({
    defaultValues: { confirmationCode: "" },
    mode: "onChange",
  });

  // Handle initial sign-up
  async function onSignUp(data: SignUpValues) {
    setIsLoading(true);
    try {
      await Auth.signUp({
        username: data.username,
        password: data.password,
        attributes: {
          email: data.email,
          "custom:role": data.role,
        },
      });
      // store for confirmation step
      setSignupUsername(data.username);
      setSignupPassword(data.password);
      setSignupSuccess(true);
      setIsLoading(false);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  // Handle code confirmation
  async function onConfirm(data: ConfirmValues) {
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(signupUsername, data.confirmationCode);
      // sign the user in immediately
      const user = await Auth.signIn(signupUsername, signupPassword);
      userHasAuthenticated(true);
      setUser(user)
      navigate("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  // Resend the confirmation code
  async function onResendCode() {
    setIsLoading(true);
    try {
      await Auth.resendSignUp(signupUsername);
      // you might want to show a toast or message here
    } catch (e) {
      onError(e);
    } finally {
      setIsLoading(false);
    }
  }

  function renderSignupForm() {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
        <Form {...signupForm}>
          <form
            onSubmit={signupForm.handleSubmit(onSignUp)}
            className="space-y-6"
          >
            <FormField
              control={signupForm.control}
              name="username"
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="JaneDoe" autoFocus />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (val) =>
                  val === signupForm.getValues("password") ||
                  "Passwords do not match",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="••••••••" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              size="lg"
              type="submit"
              className="w-full"
              disabled={!signupForm.formState.isValid || isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </Button>
          </form>
        </Form>
      </div>
    );
  }

  function renderConfirmationForm() {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
        <p className="mb-4">
          We sent a code to <strong>{signupUsername}</strong>. Enter it below to
          confirm your account.
        </p>

        <Form {...confirmForm}>
          <form
            onSubmit={confirmForm.handleSubmit(onConfirm)}
            className="space-y-6"
          >
            <FormField
              control={confirmForm.control}
              name="confirmationCode"
              rules={{ required: "Code is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmation Code</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center">
              <Button
                variant="secondary"
                onClick={onResendCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Resend Code"
                )}
              </Button>
              <Button
                size="lg"
                type="submit"
                disabled={!confirmForm.formState.isValid || isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Confirm
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="Signup">{signupSuccess ? renderConfirmationForm() : renderSignupForm()}</div>
  );
}
