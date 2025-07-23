"use client"

import ActionButton from "@/components/ActionButton"
import { MyLineup } from "@/contexts/MyLineupProvider"
import useMyLineup from "@/hooks/useMyLineup"

type Props = {
    matchId: string
    leagueId: string
    myTeamId: string
}

export default function SaveLineupButton({  }: Props) {

    const { myLineup } = useMyLineup()

    if (!myLineup.tacticalModule) return null



  return <ActionButton></ActionButton>
}
