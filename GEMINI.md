Seguendo la struttura di @src/drizzle/schema/auctionParticipants crea uno schema drizzle per la seguente tabella:

create table public.auction_acquisitions (
  id uuid not null default gen_random_uuid (),
  auction_id uuid not null,
  participant_id uuid not null,
  player_id integer not null,
  price smallint not null,
  acquired_at timestamp with time zone null default now(),
  constraint auction_acquisitions_pkey primary key (id),
  constraint auction_acquisitions_auction_id_participant_id_player_id_key unique (auction_id, participant_id, player_id),
  constraint auction_acquisitions_auction_id_fkey foreign KEY (auction_id) references auctions (id) on delete CASCADE,
  constraint auction_acquisitions_participant_id_fkey foreign KEY (participant_id) references auction_participants (id) on delete CASCADE,
  constraint auction_acquisitions_player_id_fkey foreign KEY (player_id) references players (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_auction_acquisitions_auction_id on public.auction_acquisitions using btree (auction_id) TABLESPACE pg_default;

create index IF not exists idx_auction_acquisitions_participant_id on public.auction_acquisitions using btree (participant_id) TABLESPACE pg_default;

create index IF not exists idx_auction_acquisitions_player_id on public.auction_acquisitions using btree (player_id) TABLESPACE pg_default;
