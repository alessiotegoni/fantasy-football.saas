import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  teams: {
    id: number;
    displayName: string;
    name: string;
  }[];
  onSelect: (teamId: number) => void;
};

export function TeamsSelect({ teams, onSelect }: Props) {
  return (
    <Select onValueChange={(val) => onSelect(parseInt(val))}>
      <SelectTrigger>
        <SelectValue placeholder="Seleziona una squadra" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Squadre</SelectLabel>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id.toString()}>
              {team.displayName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
