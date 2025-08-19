# Refactor gestione partecipanti asta

In src\features\(league)\auctions\actions\auctionParticipant.ts attualmente abbiamo una funzione `updateAuctionParticipant` che gestisce sia l’aggiornamento dell’ordine dei partecipanti (`order`) sia l’assegnazione del turno (`isCurrent`).
Questa soluzione è sbagliata perché mescola due casi d’uso diversi e rende il codice poco chiaro e poco manutenibile.

---

## 🎯 Obiettivi del refactor

1. **Separare le responsabilità**
   - Aggiornare **solo il turno** (un singolo partecipante può avere `isCurrent = true`).
   - Aggiornare **solo l’ordine** (quando l’admin salva l’ordine dopo un drag&drop).

3. **Ottimizzare gli update**
   - Per il turno: reset di tutti i `isCurrent` a `false`, poi set `true` solo al partecipante scelto.
   - Per l’ordine: aggiornare tutti i record in una sola query SQL con `CASE WHEN`.

4. **Azioni distinte**
   - `setAuctionTurn`
   - `updateParticipantsOrder`

N.B Utilizza le funzioni in db/auctionParticipant.ts e segui la struttura che vedi nelle altre funzioni

---

## ✅ Schemas

```ts
import { z } from "zod";
import { getUUIdSchema } from "@/schema/helpers";

// Schema base (per turno)
export const auctionParticipantSchema = z.object({
  auctionId: getUUIdSchema(),
  teamId: getUUIdSchema(),
});

// Schema per aggiornare l’ordine dei partecipanti
export const updateParticipantsOrderSchema = z.object({
  auctionId: getUUIdSchema(),
  participantsIds: z.array(getUUIdSchema()),
});

export type AuctionParticipantSchema = z.infer<typeof auctionParticipantSchema>;
export type UpdateAuctionParticipantSchema = z.infer<
  typeof updateParticipantsOrderSchema
>;
