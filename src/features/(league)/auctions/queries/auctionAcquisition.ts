// import { db } from "@/drizzle/db";
// import { and, eq } from "drizzle-orm";
// import { auctionAcquisitions } from "@/drizzle/schema";

// export async function getParticipantAcquisitions(
//   auctionId: string,
//   participantId: string
// ) {
//   const acquisitions = await db.query.auctionAcquisitions.findMany({
//     where: and(
//       eq(auctionAcquisitions.auctionId, auctionId),
//       eq(auctionAcquisitions.participantId, participantId)
//     ),
//     with: {
//       player: {
//         with: {
//           role: true,
//         },
//       },
//     },
//   });

//   return acquisitions;
// }

// export type ParticipantAcquisition = Awaited<
//   ReturnType<typeof getParticipantAcquisitions>
// >[number];
