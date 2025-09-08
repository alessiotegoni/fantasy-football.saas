export function getAuctionDuration({
  startedAt,
  endedAt,
}: {
  startedAt: Date | null;
  endedAt: Date | null;
}) {
  if (!startedAt || !endedAt) return;

  const durationMs =
    new Date(endedAt).getTime() - new Date(startedAt).getTime();
  const hours = Math.floor(durationMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

  const parts = [];
  if (hours > 0) {
    parts.push(`${hours} ${hours > 1 ? "ore" : "ora"}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes > 1 ? "minuti" : "minuto"}`);
  }

  return parts.join(" e ");
}
