## 🧠 Prompt per Gemini Code Assistant – Rendering UI Giocatore in Lineup

### 🎯 Obiettivo

Ho bisogno che tu mi aiuti a progettare e implementare la **UI per ogni giocatore** all'interno della **formation lineup** (sia titolari che panchinari) nella mia applicazione.

### 🧩 Contesto

Quando l'utente aggiunge un giocatore a uno slot (`PositionSlot`), deve essere renderizzato visivamente con le seguenti informazioni:

- ✅ **Avatar** del giocatore → usa il mio componente custom `Avatar`, **non** quello di ShadCN.
- ✅ **Nome** del giocatore.
- ✅ **Voto** (base).
- ✅ **Voto totale** (voto + bonus/malus).
- ✅ **Iconcine bonus/malus** → accanto al giocatore. Queste rappresentano eventi (gol, ammonizioni, ecc.) e modificano il voto finale.
- ✅ Supporto per **voti null o non disponibili** (es. prima del match).

> I dati sono già disponibili: voto, bonus/malus, ecc. e verranno mostrati solo se presenti.

---

### 📱 Responsive UI

L'app ha un layout diverso tra mobile e desktop:

- **Mobile**: la formazione è mostrata in **righe**.
- **Desktop**: la formazione è mostrata in **colonne**.

Ti lascio decidere **tu** come posizionare i blocchi:

- Vuoi mettere il **voto e bonus/malus sotto** al giocatore su mobile e **a lato** su desktop?
- Oppure preferisci usare sempre una **struttura verticale uniforme**?

Scegli ciò che rispetta di più UX, leggibilità e coerenza con lo stile dell'app.

---

### 🔁 UI Starter vs Bench

Fai una distinzione tra:

- 🟩 **StarterPlayers UI** → spazi stretti, layout più compatto, visualizzazione ottimizzata.
- 🟦 **BenchPlayers UI** → più spazio a disposizione, puoi arricchire il layout (ad es. mostrare più info).

---

### ✍️ Output richiesto

Crea:

1. Un componente React per mostrare **un singolo giocatore in lineup** (`LineupPlayerCard` o simile).
2. Gestione responsive e varianti UI (starter vs bench).
3. Utilizzo del mio componente custom `Avatar`.
4. Placeholder/fallback grafici in caso di voto non disponibile.
5. Bonus/malus icone visibili e leggibili.

---

📌 **NON** implementare API né salvataggi nel database. Concentrati **solo sulla UI** e sulla parte client-side, eventualmente componibile.

Puoi usare qualsiasi utilità/style già presente nel progetto (es. classnames, Tailwind, `@/components`...).

