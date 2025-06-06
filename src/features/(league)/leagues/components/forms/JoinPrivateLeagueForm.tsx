"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QrCode } from "iconoir-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import PasswordField from "./fields/PasswordField";
import {
  joinPrivateLeagueSchema,
  JoinPrivateLeagueSchema,
} from "../../schema/privateLeague";
import { joinPrivateLeague } from "@/features/leagueMembers/actions/leagueMember";
import { actionToast } from "@/lib/utils";

export default function JoinPrivateLeagueForm() {
  const searchParams = useSearchParams();

  const form = useForm<JoinPrivateLeagueSchema>({
    resolver: zodResolver(joinPrivateLeagueSchema),
    defaultValues: {
      joinCode: searchParams.get("code") ?? "",
      password: "",
    },
  });

  async function onSubmit(data: JoinPrivateLeagueSchema) {
    const res = await joinPrivateLeague(data);
    if (res.error) actionToast(res);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="joinCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Codice di Invito</FormLabel>
              <div className="relative">
                <QrCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Inserisci il codice"
                    className="pl-10"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <PasswordField placeholder="Es. Aurapiquet" />

        <SubmitButton loadingText="Entrando nella lega">
          Unisciti alla lega
        </SubmitButton>
      </form>
    </Form>
  );
}
