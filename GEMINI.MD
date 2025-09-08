Sto sviluppando la parte admin che gestisce gli split. Parti dalla pagina già creata: src\app\(consumer)\(private)\dashboard\admin\splits\page.tsx
In questa pagina devono essere mostrati tutti gli split con tutte le informazioni, ogni split deve includere:
- un componente riutilizzabile per cambiare lo status (da usare sia qui, sia nella pagina di dettaglio, sia nella card SplitMatchday che creeremo dopo),
- un bottone per eliminare lo split,
- un pulsante che porta al dettaglio di quello split (route nuova: /admin/splits/[splitId]).

Nella pagina di dettaglio di uno split (/admin/splits/[splitId]) devi utilizzare il componente `Container`. In alto mostra:
- il nome dello split,
- a destra lo stesso componente riutilizzabile dello status,
- un bottone "Crea giornate" che porta a /admin/splits/[splitId]/matchdays/create.

Sotto mostra tutte le giornate dello split (splitMatchdays), in ordine ascendente.
Ogni card di splitMatchday deve mostrare:
- tutte le informazioni,
- il componente status (adattabile sia per lo split sia per la giornata),
- un bottone modifica che porta a /admin/splits/[splitId]/matchdays/[matchdayId]/edit,
- un bottone elimina (eventualmente in un dropdown insieme al bottone modifica).

Nella pagina di dettaglio del matchday (/admin/splits/[splitId]/matchdays/[matchdayId]/edit) deve essere possibile modificare tutti i valori della giornata (tranne gli id ovviamente).

Nota importante:
- Tutti i componenti che creerai li dovrai inserire all'interno di src\features\dashboard\admin\splits\components che e' gia esistente
- Hai accesso al mio progetto, quindi puoi vedere le cartelle `drizzle/splits` e `drizzle/splitMatchdays` per capire quali sono i dati da mostrare e modificare.
- Usa uno stile coerente con il progetto, con componenti shadcn già presenti e Tailwind.
- Le server actions e le funzioni db per modificare/aggiungere/rimuovere dati le implementiamo dopo, per ora prepara i componenti e le UI.
