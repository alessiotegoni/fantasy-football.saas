"use client";

import ActionButton from "@/components/ActionButton";
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useHandleSubmit from "@/hooks/useHandleSubmit";

type Props = {
  action: {
    name: string;
    fn: () => Promise<{ error: boolean; message: string }>;
    icon: React.ElementType;
    loadingText: string;
    description: string;
  };
};

export default function MemberActionDialog({ action }: Props) {
//   const { isPending, onSubmit: handleMember } = useHandleSubmit(action.fn);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className="text-sm font-normal rounded-lg justify-start">
          <action.icon />
          {action.name}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
          <AlertDialogDescription>
            {action.description || "Questa azione non può essere annullata."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <ActionButton
            action={action.fn}
            loadingText={action.loadingText}
            variant="destructive"
            toastData={{ position: "bottom-right" }}
          >
            <action.icon />
            {action.name}
          </ActionButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
