import BackButton from "@/components/BackButton";
import EmptyState from "@/components/EmptyState";

export default function CalculateEmptyState() {
  return (
    <EmptyState
      title="Giornata non ancora calcolabile"
      description="Potrai calcolare la giornata dopo la mezzanotte e mezza"
      renderButton={() => <BackButton />}
    />
  );
}
