# Calendario e futura disponibilità

`scripts/calendar.js` gestisce il calendario della barra homepage e del modulo soggiorno su entrambe le pagine. Lo stile è in `styles/calendar.css`. Gli input originali mantengono nomi, valori ISO, vincoli e validazione del modulo.

Attualmente non esiste alcun collegamento a un backend: il provider locale restituisce dati dimostrativi deterministici, indicati come esempi nella legenda e nelle etichette accessibili. Non vengono effettuate chiamate di disponibilità o prenotazione. I giorni 12 e 26 di ogni mese sono bloccati soltanto per mostrare il comportamento.

## Interfaccia del provider

Dopo il caricamento dello script si può registrare una funzione asincrona con `window.KandelburgCalendar.setAvailabilityProvider(provider)`. La funzione riceve:

```js
{ from: '2026-10-01', to: '2026-11-30', adults: '2', children: '0', rooms: '1', signal }
```

`from` e `to` sono inclusivi, in formato `YYYY-MM-DD`. `signal` è un AbortSignal da passare alla futura richiesta HTTP. Le quantità sono i valori stringa dei select: il backend dovrà gestire anche le opzioni «o più» e l'eventuale raccolta delle età dei bambini. La barra usa una camera come valore iniziale; il modulo consente di cambiarlo.

Risposta attesa:

```js
{
  mode: 'live',
  days: {
    '2026-10-01': { status: 'available' },
    '2026-10-02': { status: 'limited' },
    '2026-10-03': { status: 'last' },
    '2026-10-04': { status: 'unavailable' },
    '2026-10-05': { status: 'unknown' }
  }
}
```

Usare `mode: 'live'` soltanto per dati reali; fixture e anteprime devono restituire `mode: 'demo'`. Le soglie tra disponibile, disponibilità limitata e ultime camere saranno definite dal gestionale, non dal frontend. Le date mancanti sono considerate da verificare e non prenotabili. Gli errori mostrano un messaggio con Riprova, senza ripiegare su disponibilità inventate. Le richieste superate vengono annullate e le risposte obsolete ignorate.

La disponibilità riguarda le notti occupate: una data non disponibile può essere usata come giorno di partenza se tutte le notti precedenti del soggiorno sono disponibili. Non si possono selezionare intervalli che attraversano notti bloccate o sconosciute. Il giorno di partenza deve seguire quello di arrivo.

## Prima dell’attivazione commerciale

Il provider è un punto di integrazione, non un sistema di prenotazione. Il backend dovrà rivalidare date, occupazione, camere, restrizioni di soggiorno e disponibilità al momento dell’invio; il controllo nel browser non riserva inventario. Andrà inoltre realizzato il vero invio delle richieste, oggi solo simulato. Le eventuali credenziali del gestionale devono restare sul server. Nessun endpoint o dato del backend Panoramik viene riutilizzato.

`window.KandelburgCalendar.refresh()` aggiorna i pulsanti quando altri script assegnano programmaticamente i valori degli input; è già chiamato all’apertura del modulo soggiorno.
