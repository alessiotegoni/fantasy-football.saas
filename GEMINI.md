# Task: Utility function per controllo crediti asta

In src\features\(league)\auctions\utils\auctionParticipant.ts crea una funzione di utilità in TypeScript che controlli se un team può effettuare una nomination o un bid in un'asta.

## Input della funzione
- `currentCredits: number` → i crediti residui del team.
- `bidAmount: number` → l'importo della nuova offerta (nomination o bid).
- `slotsRemaining: number` → quanti giocatori mancano ancora al team per completare la rosa.
- `initialCredits: number` → i crediti iniziali dell’asta (solo informativo, non usato nel calcolo).

## Logica
1. Il sistema deve garantire che il team possa sempre completare la rosa, acquistando i giocatori mancanti al prezzo minimo (che è sempre 1 credito per slot).
   Formula:
   currentCredits - bidAmount >= slotsRemaining * 1

2. Se la formula è rispettata → l’offerta è valida.
Altrimenti → non è valida.

## Output
La funzione deve restituire un oggetto:
```ts
{
valid: boolean,
reason?: string
}
valid = true → l’offerta è accettabile.

valid = false → l’offerta non è accettabile e viene specificata la reason.

## Nome funzione
`validateBidCredits`
