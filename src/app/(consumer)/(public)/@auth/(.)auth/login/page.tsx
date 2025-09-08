"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import LoginForm from "@/features/auth/components/LoginForm";
import Link from "next/link";
import Logo from "@/components/ui/logo";

export default function LoginModal() {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-sm p-0">
        <div className="pt-8 mb-8">
          <Logo />
        </div>
        <div className="px-6 pb-6">
          <h1 className="text-2xl font-heading mb-1">Accedi</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Accedendo, accetti i nostri{" "}
            <Link href="/terms" className="text-primary underline">
              Termini di Utilizzo
            </Link>
          </p>
          <LoginForm />
        </div>
      </DialogContent>
    </Dialog>
  );
}
