"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { useState, useContext } from "react";
import { useAuth } from "@/components/providers/contexts/auth-context";

export default function RegisterPage() {
  const { register, loading } = useAuth();

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

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
      const { username, password, confirmPassword } = form;
      if (password !== confirmPassword) {
        alert("Passwords do not match");
      }
      await register(username, password);

      alert("Register successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleOnSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">User name</FieldLabel>
              <Input
                id="username"
                type="text"
                onChange={handleOnChange}
                value={form.username}
                name="username"
                placeholder="your username..."
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                onChange={handleOnChange}
                value={form.password}
                name="password"
                placeholder="******"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
              <Input
                id="confirm-password"
                name="confirmPassword"
                onChange={handleOnChange}
                value={form.confirmPassword}
                type="password"
                placeholder="******"
                required
              />
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?
                  <Link href="/login" passHref>
                    <Button variant="link">Sign in</Button>
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
