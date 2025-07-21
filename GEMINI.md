# 💡 Prompt per Gemini – Refactor `MyLineupProvider`

## Contesto

Attualmente, all'interno della mia applicazione sto utilizzando un context chiamato `MyLineupProvider` che si occupa di:

1. **Gestione dello stato della formazione dell’utente**
   (starterPlayers, benchPlayers, modulo tattico, ecc.)

2. **Gestione dello stato del dialog/modal per la selezione giocatori**
   (apertura/chiusura, tipo: starter o bench)

Queste due logiche — seppur collegate — hanno scopi distinti e, nel tempo, stanno rendendo il provider più complesso e difficile da mantenere.

---

## ❓ Domanda per Gemini

Secondo te, ha senso **separare queste due responsabilità** in due context distinti?

Ad esempio:

- `MyLineupProvider`: si occupa esclusivamente della logica legata alla formazione (modulo, titolari, panchinari, ecc.)
- `LineupDialogProvider` (o simile): si occupa unicamente della gestione del dialog, del tipo di selezione e della UI

Questa separazione migliorerebbe la **leggibilità**, la **scalabilità** e la **manutenibilità** del codice.

---

## ✨ Obiettivi richiesti

Se ritieni che la separazione sia una buona scelta architetturale:

- 📦 Proponi una struttura più modulare e chiara per la gestione del contesto
- 🧼 Refactora l’hook `useMyLineup` in modo che esponga un’interfaccia coerente, pulita e semplice da usare (non utilizzare arrow functions e vedi te se utilizzare useCallback)
- 💬 Eventualmente, suggerisci una divisione del file o separazione in hook specializzati

> ✳️ NOTA: voglio mantenere compatibilità con l’architettura attuale e **non voglio nessuna logica API**, mi serve solo l’architettura e la struttura dei componenti e hook.

Grazie! 🙏
