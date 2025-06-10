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
import {
  rosterModulesSchema,
  RosterModulesSchema,
} from "../../schema/leagueOptions";
import { useLeagueOptions } from "@/hooks/useLeagueOptions";
import NumberInput from "@/components/ui/number-input";
import SubmitButton from "@/components/SubmitButton";
import OptionTooltip from "../../../../../components/FormFieldTooltip";
import {
  getTacticalModules,
} from "../../queries/leagueOptions";
import { Suspense, use } from "react";
import { getPlayersRoles } from "@/features/(league)/teamsPlayers/queries/player";

type Props = {
  initialData: RosterModulesSchema;
  leagueId: string;
  tacticalModulesPromise: ReturnType<typeof getTacticalModules>;
  playersRolesPromise: ReturnType<typeof getPlayersRoles>;
};

export function RosterOptionsForm(rosterOptions: Props) {
  const { loading, saveRosterModuleOptions } = useLeagueOptions(
    rosterOptions.leagueId
  );

  const form = useForm<RosterModulesSchema>({
    resolver: zodResolver(rosterModulesSchema),
    defaultValues: rosterOptions.initialData,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(saveRosterModuleOptions)}
        className="space-y-6"
      >
        <Suspense>
          <LeaguePlayersPerRole {...rosterOptions} />
        </Suspense>
        <Suspense>
          <LeagueTacticalModules {...rosterOptions} />
        </Suspense>

        <SubmitButton loadingText="Salvando opzioni" isLoading={loading}>
          Salva opzioni
        </SubmitButton>
      </form>
    </Form>
  );
}

function LeaguePlayersPerRole({ playersRolesPromise }: Props) {
  const form = useFormContext<Pick<RosterModulesSchema, "playersPerRole">>();

  const playersRoles = use(playersRolesPromise);

  return (
    <div className="space-y-4">
      <OptionTooltip
        label="Giocatori per ruolo"
        tip="Numero di giocatori che ogni squadra può avere per ruolo"
      >
        <div className="grid grid-cols-2 sm:flex flex-wrap gap-7">
          {playersRoles.map((role) => (
            <FormField
              key={role.id}
              control={form.control}
              name={`playersPerRole.${role.id}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">{role.name}</FormLabel>
                  <FormControl>
                    <NumberInput
                      value={field.value}
                      onChange={field.onChange}
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      </OptionTooltip>
    </div>
  );
}

function LeagueTacticalModules({ tacticalModulesPromise }: Props) {
  const form = useFormContext<Pick<RosterModulesSchema, "tacticalModules">>();

  const availableTacticalModules = use(tacticalModulesPromise);

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
                  {availableTacticalModules.map((module) => (
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
