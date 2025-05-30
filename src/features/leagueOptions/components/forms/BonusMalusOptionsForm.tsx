"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { bonusMalusSchema, BonusMalusSchema } from "../../schema/leagueOptions";
import SubmitButton from "@/components/SubmitButton";
import { useLeagueOptions } from "@/hooks/useLeagueOptions";
import { BonusMalusCategoriesType } from "@/drizzle/schema";
import { getBonusMaluses } from "../../queries/leagueOptions";
import { BonusMaluses } from "@/components/BonusMaluses";

type Props = {
  initialData: BonusMalusSchema;
  bonusMaluses: Awaited<ReturnType<typeof getBonusMaluses>>;
  leagueId: string;
};

export function BonusMalusOptionsForm({
  initialData,
  bonusMaluses,
  leagueId,
}: Props) {
  const { loading, saveBonusMalusOptions } = useLeagueOptions(leagueId);

  const form = useForm<BonusMalusSchema>({
    resolver: zodResolver(bonusMalusSchema),
    defaultValues: initialData,
  });

  const bonusMalusGrouped = Object.groupBy(
    bonusMaluses,
    (bonusMalus) => bonusMalus.category
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveBonusMalusOptions)}
        className="space-y-6"
      >
        {Object.entries(bonusMalusGrouped).map(([category, bonusMaluses]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium border-b border-border pb-2">
              {bonusMalusCategories[category as BonusMalusCategoriesType]}
            </h3>

            <div className="grid xl:grid-cols-2 2xl:flex flex-wrap gap-3">
              <BonusMaluses items={bonusMaluses} canModify={true} />
            </div>
          </div>
        ))}

        <SubmitButton loadingText="Salvando impostazioni" isLoading={loading}>
          Salva Impostazioni Generali
        </SubmitButton>
      </form>
    </Form>
  );
}

export const bonusMalusCategories: Record<BonusMalusCategoriesType, string> = {
  goals: "Goal",
  assists: "Assist",
  penalties: "Rigori",
  shotouts: "Shotouts",
  discipline: "Disciplina",
  performance: "Performance",
  goalkeeper_bonus: "Bonus/Malus portiere",
};
