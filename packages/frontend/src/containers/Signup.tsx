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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
const COGNITO_USERNAME_REGEX = /^[\p{L}\p{N}\p{P}\p{S}]+$/u
// Require at least one dot in the domain, with 2+ letter TLD
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;


export default function Signup() {
  const navigate = useNavigate();
  const { userHasAuthenticated, setUser  } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState<string>("");

  // 1) Sign-up form
  const signupForm = useForm<SignUpValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "viewer",
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
    } catch (e: any) {

      if (e.name === "UsernameExistsException") {
        signupForm.setError("username", {
          type: "manual",
          message: "That username is already taken. Please choose another.",
        });
      } else if (
        e.name === "InvalidParameterException" &&
        e.message.includes("username")
      ) {
        signupForm.setError("username", {
          type: "manual",
          message:
            "Username may only contain letters, numbers or symbols—no spaces.",
        });
      } else {
        signupForm.setError("username", {
          type: "manual",
          message: e.message || "An unexpected error occurred.",
        });
      }

      setDialogError(e.message);
      // onError(e);
      setDialogOpen(true);
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
      <div className="max-w-7xl mt-16 p-6 bg-white rounded-lg shadow">
        <Form {...signupForm}>
          <form onSubmit={signupForm.handleSubmit(onSignUp)} className="space-y-6">
            <FormField
              control={signupForm.control}
              name="username"
              rules={{
                required: "Username is required",
                pattern: {
                  value: COGNITO_USERNAME_REGEX,
                  message:
                    "Username may only contain letters, numbers or symbols—no spaces.",
                },
              }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="janedoe"
                      autoFocus
                      onChange={(e) => {
                        const normalized = e.target.value
                          .replace(/\s+/g, "");
                        field.onChange(normalized);
                      }}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>
                      {fieldState.error.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="email"
              rules={{ 
                required: "Email is required",
                pattern: {
                  // very basic RFC‑style check
                  value: EMAIL_REGEX,
                  message:
                  "Please enter a valid email (including “.com”, “.net”, etc.).",
                },
               }}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={signupForm.control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field, fieldState  }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="" />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
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
              render={({ field,fieldState }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="" />
                  </FormControl>
                  {fieldState.error && (
                    <FormMessage>{fieldState.error.message}</FormMessage>
                  )}
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

        {/*  ─── ShadCN AlertDialog ─────────────────────────────────────────────  */}
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            {/* you can also trigger this from another button elsewhere */}
            <div />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Oops, something went wrong</AlertDialogTitle>
              <AlertDialogDescription>
                {dialogError}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setDialogOpen(false)}>
                Close
              </AlertDialogCancel>
              <AlertDialogAction onClick={() => setDialogOpen(false)}>
                OK
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  function renderConfirmationForm() {
    return (
      <div className="max-w-7xl mt-16 p-6 bg-white rounded-lg shadow">
        <p className="mb-4">
          We sent a code to <strong>{signupUsername}</strong>. Enter it below to
          confirm your account.
        </p>

        <Form {...confirmForm}>
          <form
            onSubmit={confirmForm.handleSubmit(onConfirm)}
            className=""
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
    <>{signupSuccess ? renderConfirmationForm() : renderSignupForm()}</>
  );
}