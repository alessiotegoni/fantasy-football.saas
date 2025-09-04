Ciao Gemini 👋

Ho bisogno che tu mi trasformi queste tabelle Postgres in Drizzle ORM, esattamente nello stesso stile che ho già in `drizzle/schema`, e che poi tu le importi tutte dentro `drizzle/index.ts`. Non dimenticarti delle relazioni

Ecco le tabelle in SQL:

```sql
create table public.admins (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  constraint admin_pkey primary key (id),
  constraint admin_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.content_creators (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  discount_code text null,
  discount_code_count integer null,
  constraint creators_pkey primary key (id),
  constraint creators_discount_code_key unique (discount_code),
  constraint creators_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create table public.redactions (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null default gen_random_uuid (),
  team_id smallint null,
  constraint redactions_pkey primary key (id),
  constraint redactions_team_id_fkey foreign KEY (team_id) references teams (id) on delete CASCADE,
  constraint redactions_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

Cosa devi fare:

Creare i file Drizzle schema per admins, creators, redactions nello stesso formato che già uso in drizzle/schema.

Usa pgTable, uuid, text, integer, smallint, primaryKey, references ecc.

Rispetta esattamente i vincoli (FK, PK, unique).

Non cambiare i nomi delle tabelle o delle colonne.

Inserirle in drizzle/index.ts, così come già fatto per le altre tabelle.

In permissions/user.ts, ho già una funzione isAdmin(userId: string) che fa una query di tipo:

select count(*) from admins where user_id = ...

ritorna true se il count > 0, altrimenti false.

Devi creare altre due funzioni analoghe:

isCreator(userId: string) → check nella tabella creators

isRedaction(userId: string) → check nella tabella redactions

Le query devono essere scritte utilizzando il client di supabase e devono eseguire un count e ritornare un boolean.

Output atteso:

I tre file Drizzle schema pronti.

L’aggiornamento di drizzle/index.ts.

Le due nuove funzioni isContentCreator e isRedaction in permissions/user.ts, scritte nello stesso stile di isAdmin.

Non aggiungere altro, mantieni lo stesso stile e struttura già usata nel progetto.
