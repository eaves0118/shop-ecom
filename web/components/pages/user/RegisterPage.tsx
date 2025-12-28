"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field";
import { useState } from "react";
import { useAuth } from "@/components/providers/contexts/auth-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { AxiosError } from "axios";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuth();
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    email: "",
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
    const { email, password, confirmPassword } = form;
    if (password !== confirmPassword) {
      return toast.error("password do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must have at least 6 characters");
    }
    try {
      await register(email, password);
      toast.success("Successful registration! is redirecting...");
      setError(null);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message || error.message || "An error has occurred";
        setError(errorMessage);
        toast.error(errorMessage);
      }
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
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                onChange={handleOnChange}
                value={form.email}
                name="email"
                placeholder="Your email..."
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
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner /> Loading...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
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
