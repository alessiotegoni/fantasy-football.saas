Sto sviluppando una feature per permettere all’utente di compilare la sua **formazione (lineup)** per una partita.

Hai accesso completo al mio progetto, quindi puoi fare riferimento a file, tipi e componenti come TeamPlayer, LineupPlayer, TacticalModule, PositionSlot, MyLineupProvider, ecc.

### 🧠 Obiettivo:

Costruisci la logica per permettere all’utente di:

1.  Aprire la UI della partita (cliccando su un match)

2.  Cliccare su PlayerSelectTrigger, che apre il PlayerSelectDialog

3.  Cliccare su una PlayerCard per aggiungerla alla lineup


Quando un utente seleziona un giocatore (di tipo TeamPlayer), quel giocatore deve essere **convertito in LineupPlayer** aggiungendo solo i seguenti campi:

*   positionId

*   positionOrder

*   lineupPlayerId (se esiste già, lo mantiene, altrimenti rimane null)


❗ Non generare UUID temporanei.

### ⚙️ Regole:

*   ✅ **Starter lineup**:

    *   Deve essere filtrata per roleId coerente con PositionSlot

    *   positionId viene da PositionSlot, es: "Position-1"

    *   positionOrder è il numero dopo il trattino → 1

*   ✅ **Bench lineup**:

    *   Non ha restrizioni di roleId

    *   positionId = null

    *   positionOrder è incrementale: 1, 2, 3...

*   ✅ **Giocatore con ruolo da presidente**:

    *   È un giocatore normale, ma se titolare deve avere positionId = "PR-1" e positionOrder = 1


### 🚨 Problemi attuali da risolvere:

*   ❌ Il codice attuale mostra solo la lineup salvata nel DB.

*   ❌ Se un utente salva parte della formazione, esce e poi rientra, i giocatori già salvati **non vengono reinseriti nello stato** di MyLineupProvider, causando inconsistenza tra frontend e backend.

*   ❌ Manca un meccanismo per distinguere tra:

    *   Giocatori **già salvati nel DB** (lineupPlayerId presente)

    *   Giocatori **nuovi/non salvati** (lineupPlayerId = null)


### ✅ Cosa ti chiedo di costruire:

*   Un componente (o hook o funzione) che:

    *   Gestisca l'aggiunta di un TeamPlayer alla lineup

    *   Calcoli positionId e positionOrder in base al tipo di slot (starter o bench)

    *   Inserisca correttamente il LineupPlayer nello stato (MyLineupProvider)

    *   Supporti sia giocatori nuovi che già salvati

*   Una logica che:

    *   All’apertura del match, **inizializzi MyLineupProvider con i giocatori già salvati nel DB**

    *   Mantenga allineato lo stato con ciò che è stato già salvato o modificato
