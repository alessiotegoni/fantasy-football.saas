import LoginForm from "@/features/auth/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-heading mb-1">Accedi</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Accedendo, accetti i nostri{" "}
        <Link href="/terms" className="text-primary underline">
          Termini di Utilizzo
        </Link>
      </p>
      <LoginForm />
    </>
  );
}
