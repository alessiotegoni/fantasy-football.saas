import Container from "@/components/Container";

type Props = {
  params: Promise<{ leagueId: string }>;
  searchParams: Promise<{ split: string }>;
};
export default function LeagueCalendarPage({ params, searchParams }: Props) {

  const { leagueId } = await params

  return <Container headerLabel="Calendario" leagueId={}></Container>
}

async function SuspenseBoundary({  }) {

}
