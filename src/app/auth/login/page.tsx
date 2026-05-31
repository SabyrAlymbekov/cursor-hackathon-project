import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata = {
  title: "Sign in — letitbingo",
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to see your boards and join new games."
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
