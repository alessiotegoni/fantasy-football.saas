"use client";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculationSettingsSchema,
  type CalculationSettingsSchema,
} from "../../schema/setting";
import { useLeagueSettings } from "@/hooks/useLeagueSettings";
import { GoalThresholdSettings } from "../GoalThresholdSettings";

export function CalculationSettingsForm({
  leagueId,
  initialData,
}: {
  leagueId: string;
  initialData: CalculationSettingsSchema;
}) {
  const { loading, saveCalculationsSettings } = useLeagueSettings(leagueId);

  const form = useForm<CalculationSettingsSchema>({
    resolver: zodResolver(calculationSettingsSchema),
    defaultValues: initialData,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveCalculationsSettings)}
        className="space-y-6"
      >
        <GoalThresholdSettings />
      </form>
    </Form>
  );
}
