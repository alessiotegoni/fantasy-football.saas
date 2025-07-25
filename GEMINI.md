## 🧠 Prompt per Gemini Code Assistant – Mappatura LineupPlayers con Voti e Bonus/Malus

### 🎯 Obiettivo

Ho bisogno che tu analizzi il file `[matchId]/page.tsx` e costruisca la logica per **mappare i `lineupPlayers`** affinché ogni giocatore abbia:

- `vote`: già presente nella struttura dati.
- `bonusMaluses`: lista di bonus/malus correlata.
- `totalVote`: calcolato in base a `vote` + i valori dei bonus/malus personalizzati.

---

### 📦 Dati disponibili

- `lineupPlayers[]`: array di giocatori titolari/panchina, con campo `playerId` e `vote`.
- `playersBonusMaluses[]`: array di bonus/malus (contiene `playerId`, `bonusMalusTypeId`, `count`, ecc.)
- `matchInfo.leagueCustomBonusMalus`: oggetto con chiavi = ID bonus/malus, valori = numero (es. `+3`, `-1.5`, ecc.)

---

### ⚙️ Cosa voglio che venga fatto

1. 🔄 **Mappatura**: arricchisci ogni `lineupPlayer` con:
   - `bonusMaluses`: array dei bonus/malus ottenuti da `playersBonusMaluses`, filtrati per `playerId`.
   - `totalVote`: valore calcolato tramite una funzione `calculateTotalVote`.

2. 🧮 **Calcolo `totalVote`**:
   - Parti dal campo `vote` del giocatore.
   - Per ogni bonus/malus associato a quel giocatore:
     - Usa il suo `bonusMalusTypeId` per accedere al valore numerico da `leagueCustomBonusMalus`.
     - Moltiplica quel valore per `count` (lo stesso tipo di bonus/malus può essere ripetuto).
     - Somma o sottrai dal `vote` a seconda del segno.
   - Attenzione: il voto può essere `null` → in quel caso, `totalVote` dovrà essere anch’esso `null`.

3. 📦 **Output finale**:
   - Ogni `lineupPlayer` deve avere:
     ```ts
     {
       playerId: number;
       vote: number | null;
       bonusMaluses: {
         id: number;
         count: number;
         imageUrl: string;
       }[];
       totalVote: number | null;
       // ...altri campi
     }
     ```

---

### 📌 Constraints

- Non creare nessuna API.
- La logica può essere scritta in una funzione standalone (`enrichLineupPlayersWithVotes` o simile).
- Evita mutazioni: lavora con dati immutabili.
- `leagueCustomBonusMalus` è dinamico e può contenere valori sia negativi che positivi.
- Se un bonus/malus non esiste in `leagueCustomBonusMalus`, **ignoralo**.

---

### ✨ Suggerimenti opzionali

- Usa `Map<number, number>` per ottimizzare la lookup di `leagueCustomBonusMalus`.
- Scrivi test/unit logic per `calculateTotalVote()` se vuoi modularizzare bene.
- Se utile, puoi anche esportare un helper tipo `getPlayerBonusMaluses(playerId)`.

