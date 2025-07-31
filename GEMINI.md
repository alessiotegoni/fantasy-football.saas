# 🧠 UI Goal Threshold Settings – Calcio a 7

## 🎯 Obiettivo

Implementare un'interfaccia utente per la configurazione delle soglie goal in una Lega di Fantacalcio a 7, ispirata alla UI ufficiale della Lega Serie A ma **adattata alla logica semplificata e coerente** della mia applicazione.

---

## 📁 File da leggere

Per realizzare correttamente la modifica, **leggi attentamente i seguenti file presenti nel progetto**:

- `LeagueCalculationSettingsPage`
- `CalculationSettingsForm` ← **Inserisci qui la logica descritta**

> ⚠️ **Nota importante**: tutti i componenti di questa UI, inclusi quelli eventualmente creati appositamente, devono essere **utilizzati all'interno di `FormFieldTooltip`**, seguendo il pattern già in uso nel progetto.

---

## 📷 Riferimento UI

Usa il file `ui-example.png` come **riferimento visivo** per lo stile e la disposizione della UI.
Riproduci una versione **orizzontale**, adattata alla logica descritta di seguito e **coerente con lo stile visivo già usato nel progetto**.

---

## ⚙️ Logica da implementare

La UI deve permettere all’utente di impostare due parametri:

1. **Soglia base (`base`)**: il punteggio a partire dal quale si segna il primo goal (default `58`)
2. **Intervallo (`interval`)**: ogni quanti punti aggiuntivi si segna un goal in più (default `6`)

La UI **non deve permettere di inserire tutte le soglie manualmente**.

---

### 📈 Calcolo delle soglie (dinamico)

Le soglie vengono generate automaticamente a partire da questi due valori, ad esempio:

```json
{
  "base": 58,
  "interval": 6
}
```

Questo significa:
- 1° goal: 58 punti
- 2° goal: 64 punti
- 3° goal: 70 punti
- 4° goal: 76 punti
- 5° goal: 82 punti
- ...e così via

Il numero di goal dipende quindi **solo** dal punteggio totale del team e da questi due parametri.

---

## 🧩 Componenti richiesti nella UI

### 1. **Slider orizzontale di preview**

- Mostra graficamente una scala dei punteggi in cui si segnano i goal.
- In ascissa: i punteggi (58, 64, 70, ...)
- In ordinata (sopra o sotto): il numero di goal (1, 2, 3, ...)
- Deve aggiornarsi dinamicamente quando cambiano `base` o `interval`
- **Non deve essere interattivo**, è solo una preview
- Deve essere **scrollabile orizzontalmente su mobile**

### 2. **Input configurabili**

Due campi numerici all’interno di `FormFieldTooltip`:

- `⚽ Primo goal a:` → input `base` (default `58`)
- `🔁 Intervallo goal:` → input `interval` (default `6`)

Modificando uno di questi, si aggiorna anche lo slider.

### 3. **Anteprima testuale**

Sotto lo slider, aggiungi una preview testuale generata dinamicamente:

```
Esempio:
Punti 58 → 1 gol
Punti 64 → 2 gol
Punti 70 → 3 gol
Punti 76 → 4 gol
...
```

Mostrane almeno 5 per chiarezza.

---

## ✅ Requisiti funzionali

- La logica va **inserita dentro `CalculationSettingsForm`**
- Tutti i componenti devono essere **wrappati dentro `FormFieldTooltip`**
- Deve seguire lo **stile visivo già usato nell'app** (colori, tipografia, spacing)
- Deve essere **responsive** (scroll orizzontale su mobile)
- Gli input devono essere **validati**:

```ts
base >= 40 && base <= 100
interval >= 1 && interval <= 20
```

In caso contrario, mostra un messaggio d’errore.

---

## 🧪 Comportamento atteso

1. L’utente imposta `base` e `interval`
2. La UI aggiorna la preview slider e la preview testuale
3. I dati vengono salvati come:

```json
{
  "base": 58,
  "interval": 6
}
```

nella configurazione della lega, in sostituzione del precedente sistema a soglie manuali.

---

## 📌 Riassunto finale

| Campo       | Tipo     | Default | Note                          |
|-------------|----------|---------|-------------------------------|
| base        | number   | 58      | Punteggio minimo per 1 gol    |
| interval    | number   | 6       | Ogni quanti punti si fa 1 gol |

---

## 🔁 Integrazione

Inserisci tutto il codice e la logica UI direttamente dentro **`CalculationSettingsForm`**, utilizzando `FormFieldTooltip` per ciascun componente, e rispettando il design system già presente nell'applicazione.
