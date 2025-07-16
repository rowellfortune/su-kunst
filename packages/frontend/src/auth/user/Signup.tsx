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
import { type ISignUpResult } from "amazon-cognito-identity-js";

interface SignupFormValues {
  username: string;
  email: string,
  password: string,
  confirmPassword: string,
  confirmationCode: string,
  attributes: {
    email: string;
    "custom:role": string; // ✅ Assign role dynamically
  },
  role: string;
}

export default function Signup() {

  const form = useForm<SignupFormValues>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      confirmationCode: "",
      role: 'viewer'
    },
    mode: "onChange",
  });

  const nav = useNavigate();
  const { userHasAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<null | ISignUpResult>(null);

  async function onSubmit(data: SignupFormValues) {
    console.log(data);
    setIsLoading(true);
    try {
      const newUser = await Auth.signUp({
        username: data.username,
        password: data.password,
        attributes: {
          email: data.email,
          "custom:role": data.role, // ✅ Assign role dynamically
        },
    });
      setIsLoading(false);
      setNewUser(newUser);
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  async function handleConfirmationSubmit(data: SignupFormValues) {
    setIsLoading(true);
    try {
      await Auth.confirmSignUp(data.username, data.confirmationCode);
      await Auth.signIn(data.username, data.password);
      userHasAuthenticated(true);
      nav("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }

  function renderConfirmationForm() {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleConfirmationSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="confirmationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmation</FormLabel>
                <FormControl>
                  <Input type="text" id="confirmationCode" placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            size={"lg"}
            type="submit"
            className="w-full"
            disabled={!form.formState.isValid || isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign Up
          </Button>
        </form>
      </Form>
    );
  }

  function renderForm() {
    return (
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-lg shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              rules={{ required: "User is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="JaneDoe"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
              control={form.control}
              name="confirmPassword"
              rules={{ required: "Password is required" }}
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
              type="submit"
              className="w-full"
              disabled={!form.formState.isValid || isLoading}
            >
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Sign Up
            </Button>

          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}
