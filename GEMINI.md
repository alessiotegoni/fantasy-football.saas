# 🧩 Prompt per Gemini – Problema Rendering Dettaglio Match

## 🧠 Contesto

All’interno della cartella `matches`, ho una pagina di dettaglio match che, al click dell’utente, apre tutta la UI per comporre la formazione (starter e bench).
L’applicazione si avvia correttamente, ma **appena accedo al dettaglio di un match ricevo un errore a runtime**. Dì che di solito succede quando stai chiamando una funzione server, quindi con dentro cose server nel client, o stai chiamando una funzione di rivalidazione nel client, o anche gli import contano.

---

## ❌ Errore

```bash
Error: ./src/features/(league)/leagues/db/cache/league.ts:1:10
Ecmascript file had an error
> 1 | import { revalidateTag } from "next/cache";
   |          ^^^^^^^^^^^^^^^
