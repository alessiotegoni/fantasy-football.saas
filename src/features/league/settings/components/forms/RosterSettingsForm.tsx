"use client";

import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CheckboxCard from "@/components/ui/checkbox-card";
import { rosterModulesSchema, RosterModulesSchema } from "../../schema/setting";
import { useLeagueSettings } from "@/hooks/useLeagueSettings";
import NumberInput from "@/components/ui/number-input";
import SubmitButton from "@/components/SubmitButton";
import OptionTooltip from "../../../../../components/FormFieldTooltip";
import { playerRoles, PlayersPerRole, TacticalModule } from "@/drizzle/schema";
import PlayersPerRoleField from "@/components/PlayersPerRoleField";

type Props = {
  initialData: RosterModulesSchema;
  leagueId: string;
  tacticalModules: TacticalModule[];
  playersRoles: (typeof playerRoles.$inferSelect)[];
};

export function RosterSettingsForm(rosterSettings: Props) {
  const { loading, saveRosterModuleSettings } = useLeagueSettings(
    rosterSettings.leagueId
  );

  const form = useForm<RosterModulesSchema>({
    resolver: zodResolver(rosterModulesSchema),
    defaultValues: rosterSettings.initialData,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveRosterModuleSettings)}
        className="space-y-6"
      >
        <PlayersPerRoleField {...rosterSettings} />
        <TacticalModulesField {...rosterSettings} />

        <SubmitButton loadingText="Salvando opzioni" isLoading={loading}>
          Salva opzioni
        </SubmitButton>
      </form>
    </Form>
  );
}

function TacticalModulesField({ tacticalModules }: Props) {
  const form = useFormContext<Pick<RosterModulesSchema, "tacticalModules">>();

  return (
    <div>
      <OptionTooltip
        tip="Moduli tattici che i membri della lega potranno utilizzare"
        label="Moduli tattici"
        classNames={{ description: "mt-2" }}
      >
        <FormField
          control={form.control}
          name="tacticalModules"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
                  {tacticalModules.map((module) => (
                    <CheckboxCard
                      key={module.id}
                      label={module.name}
                      checked={field.value.includes(module.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          field.onChange([...field.value, module.id]);
                        } else {
                          field.onChange(
                            field.value.filter((id) => id !== module.id)
                          );
                        }
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </OptionTooltip>
    </div>
  );
}
