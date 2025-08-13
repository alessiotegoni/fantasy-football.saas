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
import { auctionSchema, AuctionSchema } from "../schema/auctionSettings";
import { AuctionType, playerRoles, PlayersPerRole } from "@/drizzle/schema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import AuctionTypeField from "./AuctionTypeField";
import MobileButtonsContainer from "@/components/MobileButtonsContainer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FormSliderField from "@/components/FormFieldSlider";
import { useEffect } from "react";
import PlayersPerRoleField from "@/components/PlayersPerRoleField";
import { useParams } from "next/navigation";
import { createAuction, updateAuction } from "../actions/auction";
import NumberInput from "@/components/ui/number-input";

type Props = {
  auction: {
    id?: string;
    leagueId?: string;
    name?: string;
    description?: string | null;
    type?: AuctionType;
    firstCallTime?: number;
    othersCallsTime?: number;
    initialCredits: number;
    playersPerRole: PlayersPerRole;
  };
  playersRoles?: (typeof playerRoles.$inferSelect)[];
  isSplitLive?: boolean;
};

export default function AuctionForm({
  auction,
  playersRoles,
  isSplitLive,
}: Props) {
  const toast = useActionToast();

  const { leagueId } = useParams<{ leagueId: string }>();

  const form = useForm<AuctionSchema>({
    resolver: zodResolver(auctionSchema),
    defaultValues: auction.id
      ? auction
      : {
          leagueId,
          type: isSplitLive ? "repair" : "classic",
          name: "",
          description: null,
          initialCredits: auction.initialCredits,
          playersPerRole: auction.playersPerRole,
          firstCallTime: auction.firstCallTime ?? 20,
          othersCallsTime: auction.othersCallsTime ?? 10,
        },
  });

  const auctionType = form.watch("type");

  useEffect(() => {
    if (auctionType === "repair") form.setValue("creditsToAdd", 50);
  }, [auctionType]);

  async function onSubmit(data: AuctionSchema) {
    const action = auction.id
      ? updateAuction.bind(null, auction.id)
      : createAuction;

    const result = await action(data);

    toast(result);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 sm:space-y-6 pb-12 sm:pb-0"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="King del vintage"
                  className="px-4"
                />
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
                  className="rounded-2xl"
                  value={value ?? ""}
                  onChange={(e) => onChange(e.target.value || null)}
                  {...restField}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!auction.id && <AuctionTypeField isSplitLive={isSplitLive} />}

        <Accordion type="single" collapsible>
          <AccordionItem value="advanced-settings">
            <AccordionTrigger className="font-sans text-base font-medium p-0 py-3 sm:pt-0 aria-expanded:pb-6">
              Impostazioni avanzate
            </AccordionTrigger>
            <AccordionContent className="space-y-3 sm:space-y-6">
              <div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-base font-medium font-sans mb-3">
                      Tempo dalla prima chiamata
                    </h3>
                    <FormField
                      control={form.control}
                      name="firstCallTime"
                      render={({ field }) => (
                        <FormItem className="sm:w-fit">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <NumberInput {...field} min={10} max={60} />
                            </FormControl>
                            secondi
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-medium font-sans mb-3">
                      Tempo dalle altre chiamate
                    </h3>
                    <FormField
                      control={form.control}
                      name="othersCallsTime"
                      render={({ field }) => (
                        <FormItem className="sm:w-fit">
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <NumberInput {...field} min={5} max={40} />
                            </FormControl>
                            secondi
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              {auctionType === "classic" && playersRoles && (
                <div className="space-y-3 sm:space-y-6">
                  <PlayersPerRoleField playersRoles={playersRoles} />
                  <FormSliderField<{ initialCredits: number }>
                    name="initialCredits"
                    label="Crediti iniziali per squadra"
                    min={200}
                    max={5000}
                    step={50}
                    unit="crediti"
                  />
                </div>
              )}
              {auctionType === "repair" && (
                <div>
                  <FormSliderField<{ creditsToAdd: number }>
                    name="creditsToAdd"
                    label="Crediti da aggiungere"
                    tip="Crediti da aggiungere a tutte le squadre"
                    min={0}
                    max={auction.initialCredits}
                    step={10}
                    unit="crediti"
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <MobileButtonsContainer className="sm:w-full">
          <SubmitButton
            loadingText={auction.id ? "Modifico asta" : "Creo asta"}
          >
            {auction.id ? "Modifica asta" : "Crea asta"}
          </SubmitButton>
        </MobileButtonsContainer>
      </form>
    </Form>
  );
}
