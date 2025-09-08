Ciao 👋
Ho bisogno che tu mi generi un componente **Sidebar** in React/Next.js utilizzando **Tailwind CSS** e i componenti **sidebar di shadcn/ui**.

### Requisiti:
- La sidebar sarà usata nel layout della route `/dashboard`.
- I link devono essere raggruppati in sezioni (con intestazione del gruppo).
- La visibilità delle sezioni dipende dai ruoli dell’utente (tranne la sezione utente che non ha bisogno di ruoli), accessibili tramite il custom hook `useDashboardRoles()` che restituisce un array di stringhe, ad esempio: `["admin", "content-creator", "redaction"]`.
- All’interno della sidebar mostra solo i gruppi e i link consentiti dai ruoli dell’utente.

---

### Gruppi e link

#### Gruppo 1: Utente (visibile sempre)
- Profilo → `/dashboard/user/profile`
- Premium → `/dashboard/user/premium`

#### Gruppo 2: Admin (visibile se l’utente ha ruolo `admin`)
- Splits → `/dashboard/admin/splits`
- Squadre → `/dashboard/admin/teams`
- Giocatori → `/dashboard/admin/players`
- Assegna bonus/malus → `/dashboard/admin/bonus`
- Admins (gestione admin → visibile **solo se l’id utente è uguale a quello presente in `process.env.SUPERADMIN_ID`**)
  → `/dashboard/admin/admins`
- Content creators (gestione content creators) → `/dashboard/admin/content-creators`
- Redazione (gestione redazioni) → `/dashboard/admin/redactions`
- Premium (gestione premium utenti) → `/dashboard/admin/premium`

#### Gruppo 3: Content creators (visibile se l’utente ha ruolo `creator`)
- Codice sconto → `/dashboard/creator/discount-code`
- Statistiche varie → `/dashboard/creator/stats`

#### Gruppo 4: Redazione (visibile se l’utente ha ruolo `redaction`)
- Assegna voti → `/dashboard/redaction/assign-votes`
- Modifica voti → `/dashboard/redaction/edit-votes`
- Statistiche team → `/dashboard/redaction/team-stats`

---

### Struttura tecnica
- Usa i componenti sidebar di **shadcn/ui** (`Sidebar`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarMenu`, `SidebarMenuItem`, `SidebarMenuButton`).
- Lo stile deve seguire il design system del progetto.
- Il componente deve leggere i ruoli da `useDashboardRoles()`.
- Per il check del super admin, confronta l’`userId` (puoi simularlo come prop `currentUserId`) con `process.env.SUPERADMIN_ID`.

---

### Output
- Un singolo componente React chiamato `DashboardSidebar` in dashboard/components.
- Deve includere la logica di rendering condizionale dei gruppi/link.
- Deve essere pronto per essere importato e usato in `app/dashboard/layout.tsx`.
