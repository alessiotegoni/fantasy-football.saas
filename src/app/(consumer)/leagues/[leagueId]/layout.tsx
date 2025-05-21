import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ leagueId: string }>;
};

export default function LeagueLayout({ children, params }: Props) {

}
