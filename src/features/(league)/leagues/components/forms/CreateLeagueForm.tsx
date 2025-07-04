"use client";

import { Form } from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { createLeague } from "../../actions/league";
import PasswordField from "./fields/PasswordField";
import LeagueTypeField from "./fields/LeagueTypeField";
import {
  createLeagueSchema,
  CreateLeagueSchema,
} from "../../schema/createLeague";
import { JOIN_CODE_LENGTH } from "../../schema/leagueBase";
import LeagueNameField from "../../../../../components/NameField";
import LeagueDescriptionField from "./fields/LeagueDescriptionField";
import LeagueImageField from "../../../../../components/ImageField";

export default function CreateLeagueForm() {
  const form = useForm<CreateLeagueSchema>({
    resolver: zodResolver(createLeagueSchema),
    defaultValues: {
      name: "",
      description: null,
      password: "",
      image: null,
      visibility: "private",
      joinCode: generateJoinCode(),
    },
  });

  async function onSubmit(data: CreateLeagueSchema) {
    const res = await createLeague(data);

    if (res.error) toast.error(res.message);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <LeagueNameField
          label="Nome della Lega"
          tip="Il nome della lega è visualizzabile da tutti gli utenti e non sara' piu modificabile"
          placeholder="Es. Champions League"
        />

        <LeagueImageField
          label="Logo della Lega"
          tip="Il logo della lega è visualizzabile da tutti gli utenti"
        />

        <LeagueTypeField />

        {form.watch("visibility") === "private" && <PasswordField />}

        <LeagueDescriptionField />

        <SubmitButton loadingText="Creando lega" variant="gradient">
          Crea lega
        </SubmitButton>
      </form>
    </Form>
  );
}

function generateJoinCode(length = JOIN_CODE_LENGTH) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function handleCopyCode(code: string) {
  try {
    await navigator.clipboard.writeText(code);
    toast.success("Codice copiato");
  } catch (err) {
    console.error(err);
    toast.error("Errore, codice non copiato");
  }
}
