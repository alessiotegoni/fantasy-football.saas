import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Calendar, Trophy } from "iconoir-react";
import Image from "next/image";
import { default as LeagueHeader } from "@/features/leagues/components/Header";
import Logo from "@/components/ui/logo";
import BackButton from "@/components/BackButton";

export default async function LeagueDetailPage({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  //   const league = mockPublicLeagues.find((l) => l.id === params.leagueId)

  //   if (!league) {
  //     notFound()
  //   }

  //   const occupancyPercentage = (league.currentMembers / league.maxMembers) * 100

  return (
    <>
      <LeagueHeader className="relative">
        <BackButton />
        <div className="flex flex-col items-center pt-5 pb-7">
          <Logo withText={false} className="mt-5" />
          <h1 className="text-2xl font-heading text-center text-primary-foreground my-2">
            {league.name}
          </h1>
        </div>
      </LeagueHeader>

      <main className="px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Informazioni principali */}
          <div className="bg-background rounded-2xl border border-border p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-heading">{league.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Creata il{" "}
                    {new Date(league.createdAt).toLocaleDateString("it-IT")}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground mb-6">{league.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-primary mr-1" />
                </div>
                <p className="text-2xl font-heading">{league.currentMembers}</p>
                <p className="text-sm text-muted-foreground">Membri attuali</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-primary mr-1" />
                </div>
                <p className="text-2xl font-heading">{league.maxMembers}</p>
                <p className="text-sm text-muted-foreground">Posti totali</p>
              </div>
            </div>

            {/* Barra di progresso */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span>Posti occupati</span>
                <span>{Math.round(occupancyPercentage)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${occupancyPercentage}%` }}
                />
              </div>
            </div>

            <JoinLeagueButton leagueId={league.id} leagueName={league.name} />
          </div>

          {/* Lista membri */}
          <div className="bg-background rounded-2xl border border-border p-6">
            <h3 className="text-lg font-heading mb-4">
              Membri ({league.currentMembers})
            </h3>

            <div className="space-y-3">
              {league.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center space-x-3 p-3 bg-muted/30 rounded-xl"
                >
                  <Image
                    src={member.avatar || "/placeholder.svg?height=40&width=40"}
                    alt={member.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Iscritto il{" "}
                      {new Date(member.joinedAt).toLocaleDateString("it-IT")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer>
        <Disclaimer />
      </footer>
    </>
  );
}
