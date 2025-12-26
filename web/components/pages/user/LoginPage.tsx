"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/contexts/auth-context";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const { login, loading } = useAuth();

  const handleOnChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { username, password } = form;
      await login(username, password);
    } catch (error) {
      alert("Invalid username or password");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Link href="/register" passHref>
            <Button variant="link">Sign Up</Button>
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOnSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel>User name</FieldLabel>
              <Input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleOnChange}
                placeholder="Your user name..."
                required
              />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                id="password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleOnChange}
                placeholder="******"
                required
              />
            </Field>
            <Field>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
