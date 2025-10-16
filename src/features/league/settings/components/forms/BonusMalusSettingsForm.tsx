"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { bonusMalusSchema, BonusMalusSchema } from "../../schema/setting";
import SubmitButton from "@/components/SubmitButton";
import { useLeagueSettings } from "@/hooks/useLeagueSettings";
import { BonusMaluses } from "@/components/BonusMaluses";
import { BonusMalusType } from "@/features/dashboard/admin/bonusMaluses/queries/bonusMalusType";
import { BonusMalusCategory } from "@/drizzle/schema";

type Props = {
  initialData: BonusMalusSchema;
  bonusMaluses: BonusMalusType[];
  leagueId: string;
};

export function BonusMalusSettingsForm({
  initialData,
  bonusMaluses,
  leagueId,
}: Props) {
  const { loading, saveBonusMalusSettings } = useLeagueSettings(leagueId);

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
        onSubmit={form.handleSubmit(saveBonusMalusSettings)}
        className="space-y-6"
      >
        {Object.entries(bonusMalusGrouped).map(([category, bonusMaluses]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-lg font-medium border-b border-border pb-2">
              {bonusMalusCategories[category as BonusMalusCategory]}
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

export const bonusMalusCategories: Record<BonusMalusCategory, string> = {
  goals: "Goal",
  assists: "Assist",
  penalties: "Rigori",
  shotouts: "Shotouts",
  discipline: "Disciplina",
  performance: "Performance",
  goalkeeper_bonus: "Bonus/Malus portiere",
};
