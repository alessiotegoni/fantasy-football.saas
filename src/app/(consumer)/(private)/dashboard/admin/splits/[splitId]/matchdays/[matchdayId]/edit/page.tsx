"use client";

import Container from "@/components/Container";
import { SplitMatchday, matchdayTypes } from "@/drizzle/schema/splitMatchdays";
import { splitStatuses, SplitStatusType } from "@/drizzle/schema/splits";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface MatchdayEditPageProps {
  params: {
    splitId: string;
    matchdayId: string;
  };
}

const formSchema = z.object({
  number: z.coerce.number().min(1, "Matchday number must be at least 1"),
  startAt: z.string().min(1, "Start date is required"),
  endAt: z.string().min(1, "End date is required"),
  status: z.enum(splitStatuses),
  type: z.enum(matchdayTypes),
});

export default function MatchdayEditPage({ params }: MatchdayEditPageProps) {
  const { splitId, matchdayId } = params;

  // Mock data for a single matchday
  const mockMatchday: SplitMatchday = {
    id: parseInt(matchdayId),
    splitId: parseInt(splitId),
    number: 1,
    startAt: new Date("2025-09-01T10:00:00Z"),
    endAt: new Date("2025-09-02T10:00:00Z"),
    status: "upcoming" as SplitStatusType,
    type: "regular",
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      number: mockMatchday.number,
      startAt: format(new Date(mockMatchday.startAt), "yyyy-MM-dd'T'HH:mm"),
      endAt: format(new Date(mockMatchday.endAt), "yyyy-MM-dd'T'HH:mm"),
      status: mockMatchday.status,
      type: mockMatchday.type,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted:", values);
    // Here you would typically call a server action to update the matchday
  }

  return (
    <Container headerLabel={`Edit Matchday ${mockMatchday.number}`}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matchday Number</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date & Time</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {splitStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {matchdayTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Save Changes</Button>
        </form>
      </Form>
    </Container>
  );
}
