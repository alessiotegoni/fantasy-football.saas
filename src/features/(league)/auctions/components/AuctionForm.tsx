"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import SubmitButton from "@/components/SubmitButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useActionToast from "@/hooks/useActionToast";
import { auctionSchema, AuctionSchema } from "../schema/auction";
import { AuctionType, PlayersPerRole } from "@/drizzle/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AuctionTypeField from "./AuctionTypeField";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";

type Props = {
  auction: {
    id?: string;
    name?: string;
    description?: string | null;
    type?: AuctionType;
    firstCallTime?: number;
    othersCallsTime?: number;
    initialCredits: number;
    playersPerRole: PlayersPerRole;
  };
};

export default function AuctionForm({ auction }: Props) {
  const toast = useActionToast();

  const form = useForm<AuctionSchema>({
    resolver: zodResolver(auctionSchema),
    defaultValues: auction.id
      ? auction
      : {
          type: "classic",
          initialCredits: auction.initialCredits,
          playersPerRole: auction.playersPerRole,
          firstCallTime: auction.firstCallTime ?? 20,
          othersCallsTime: auction.othersCallsTime ?? 10,
        },
  });

  const auctionType = form.watch("type");

  async function onSubmit(data: AuctionSchema) {}

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} placeholder="King del vintage" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field: { value, onChange, ...restField } }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Aura sorriset"
                  value={value ?? ""}
                  onChange={(e) => onChange(e.target.value || null)}
                  {...restField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AuctionTypeField />

        <MobileButtonsContainer className="sm:w-full">
          <SubmitButton loadingText="Creo asta">Crea asta</SubmitButton>
        </MobileButtonsContainer>
      </form>
    </Form>
  );
}
