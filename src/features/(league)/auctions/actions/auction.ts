import { validateSchema } from "@/schema/helpers";
import { auctionSchema, AuctionSchema } from "../schema/auctionSettings";
import { canCreateAuction, canUpdateAuction } from "../permissions/auction";

enum AUCTION_MESSAGES {
  ADMIN_REQUIRED = "Per aggiornare il profilo della lega devi essere admin",
  PROFILE_UPDATED = "Profilo aggiornato con successo",
}

export async function createAuction(values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<AuctionSchema>(
    auctionSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canCreateAuction();
}

export async function updateAuction(id: string, values: AuctionSchema) {
  const { isValid, data, error } = validateSchema<AuctionSchema>(
    auctionSchema,
    values
  );
  if (!isValid) return error;

  const permissions = await canUpdateAuction();
}
