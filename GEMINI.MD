# Prompt per Gemini – Gestione scadenze con pg-boss

Nel progetto (vedi: src\features\(league)\auctions) stiamo gestendo un sistema di aste con **nominations**, **bids** e **acquisitions**.
Ogni nomination (src\drizzle\schema\auctionNominations.ts) e ogni bid (src\drizzle\schema\auctionBids.ts) ha una scadenza (`expiresAt`). Quando il timer scade devono succedere due cose:

1. La nomination deve cambiare stato in `sold`.
2. Se esistono bids per quella nomination, bisogna prendere l’ultima e creare un record in `auction_acquisitions` (funzioni gia create).
   Se non ci sono bids, si usa la nomination stessa come base per creare l’acquisition.

Per implementare questa logica vogliamo usare **pg-boss** come job queue.

---

## Cosa serve fare

1. **Creare un’istanza di pg-boss**
   - In `src/lib/pg-boss.ts` creare e inizializzare l’istanza di pg-boss.
   - Assicurarsi che sia singleton e riutilizzabile in tutto il progetto.

2. **Creare delle helper functions** per incapsulare l’uso di pg-boss:
   - `scheduleExpiryJob(nominationId: string, expiresAt: Date)`
     - Usa `boss.send` con `startAfter`
   - `cancelExpiryJob(nominationId: string)`
     - Cancella il job collegato a quella nomination (o bid).
   - Queste funzioni devono stare in un file dentro la cartella src\features\(league)\auctions\utils.

3. **Integrare i job nelle server actions**:
   - In `createNomination` → dopo l’inserimento della nomination, chiamare `scheduleExpiryJob` passando `expiresAt`.
   - In `createBid` → se il bid estende il timer, aggiornare `expiresAt` e riprogrammare il job (`cancelExpiryJob` e poi `scheduleExpiryJob`).
   - In `deleteNomination` → eliminare la nomination e cancellare anche il job relativo (`cancelExpiryJob`).

4. **Worker per il job di scadenza**
   - Registrare un worker che ascolti i job del tipo `"nomination-expiry"`.
   - Quando il job parte:
     - Controlla lo stato della nomination.
     - Se scaduta, aggiorna la nomination a `sold`.
     - Se ci sono bids → prendi l’ultimo e crea l’acquisition.
     - Se non ci sono → crea l’acquisition con i dati della nomination.

---

## Nota sulle API pg-boss
- Per programmare il job **una sola volta** con `expiresAt` → usare `boss.send("nomination-expiry", { nominationId }, { startAfter: expiresAt })`.

---

## Obiettivo finale
Alla fine vogliamo un sistema dove:
- Ogni nomination/bid programma automaticamente un job di scadenza.
- Il job viene eseguito immediatamente alla scadenza, senza polling manuale.
- Tutto il codice relativo a pg-boss è centralizzato in `src/lib/pg-boss.ts` e helper functions dedicate.

# Sistema coerente di jobs names & keys

Devo inolte introdurre un sistema di gestione dei job names e delle singletonKeys per pg-boss simile a quello che utilizzo per i cache tags, ma strutturato in maniera modulare per feature.

## Requisiti principali

Definire un tipo JOB_NAME con tutte le categorie di job globali dell’applicazione (es. "nomination-expiry").

Creare funzioni generiche per comporre nomi e chiavi:

getJobName(tag: JOB_NAME)

getJobKey(id: string, tag: JOB_NAME)

Ogni feature (in questo caso auction) avrà la propria cartella src/features/[nome-feature]/jobs/ con funzioni helper dedicate ai job di quella feature.

Esempio:

src/features/auction/jobs/auctionNomination.ts con funzioni getNominationExpiryJobName(), getNominationExpiryKey(nominationId: string).


Modalità di utilizzo

Ogni job deve essere creato con boss.send(jobName, payload, { startAfter, singletonKey }).

La singletonKey deve sempre identificare univocamente l’entità (es. 123-auction-expiry) per poterla sostituire o eliminare facilmente.

Per la cancellazione dei job si userà boss.deleteKey(singletonKey), richiamando sempre le funzioni helper per evitare stringhe hardcoded.

Obiettivo

Uniformità: tutti i job definiti in un sistema coerente e tipizzato.

Scalabilità: nuove feature possono definire i propri job localmente nella cartella jobs senza rompere lo schema.

Manutenibilità: come per i cache tags, eliminare stringhe hardcoded sparse nel codice.

Chiarezza: chi legge il codice capisce subito da quale feature e da quale entità deriva il job.
