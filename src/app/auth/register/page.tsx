import { RegisterForm } from "@/components/auth/register-form";
import { AuthLayout } from "@/components/auth/auth-layout";

export const metadata = {
  title: "Join letitbingo — Create your account",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Join the game"
      subtitle="Create your account and start playing."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
