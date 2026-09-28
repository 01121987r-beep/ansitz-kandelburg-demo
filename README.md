# Ansitz Kandelburg — proposta visuale

Demo statica in italiano con homepage e pagina Contatti per presentare il restyling della dimora. Palette avorio e sabbia, tipografia Libre Caslon Display / Jost, fotografie reali e logo originale.

## Demo online

https://01121987r-beep.github.io/ansitz-kandelburg-demo/

Pubblicazione tramite GitHub Pages dal ramo `main`, cartella principale. Le modifiche caricate su `main` aggiornano automaticamente la demo. Il file `.nojekyll` abilita la pubblicazione statica diretta.

## Anteprima

Aprire `index.html` direttamente nel browser, oppure dalla cartella del progetto:

```sh
python3 -m http.server 4178 --bind 127.0.0.1
```

Visitare http://127.0.0.1:4178/. Non servono installazione, build o configurazioni. Il progetto è pronto per un hosting statico. Non è previsto alcun processo di build.

## Interazioni

- Intro con logo originale, uscita animata, pulsante per saltarla e replay nel footer.
- Header trasparente su entrambe le pagine e avorio traslucido allo scorrimento; sottomenu Albergo, Servizio, Eventi e Stagioni, con navigazione mobile a espansione.
- Hero fotografica a tre scene con selezione manuale, avanzamento automatico e puntini di navigazione.
- Carosello camere con tre fotografie, frecce bianche senza sfondo, puntini, tastiera e swipe; descrizione estesa affiancata su desktop. Selettore interattivo delle quattro stagioni.
- Pagina `contatti.html` con testata fotografica; recapiti, mappa e modulo affiancati. I pannelli di mappa e modulo hanno dimensioni uguali su desktop.
- Sezione Contatti in homepage con icone in riga, indirizzo e partita IVA, mappa e modulo con campo telefono facoltativo.
- Pulsante fluttuante WhatsApp/Viber e assistente locale con risposte predefinite, senza AI, rete o persistenza dei messaggi.
- Fotografie rettangolari con angoli morbidi, chiusure senza cerchio e link testuali nel footer.
- Switch IT / DE / EN: italiano attivo, altre lingue indicate come prossimamente disponibili.
- Galleria ingrandita con pulsanti testuali Precedente/Successiva, tasti freccia della tastiera, chiusura con Escape e focus gestito dal dialogo nativo.
- Pulsanti dalle forme morbide. Nessun numero decorativo o contatore sulle fotografie; le frecce nel carosello servono alla navigazione.
- Date, adulti e bambini con riepilogo dimostrativo: date passate e partenze precedenti all’arrivo non ammesse.
- Calendario personalizzato nella barra e nel modulo, con due mesi su desktop e uno su mobile. Legenda salvia, ocra e terracotta, date selezionate evidenziate e disponibilità esplicitamente simulate. Interfaccia per il futuro backend documentata in `docs/calendar-backend.md`.
- Entrate allo scorrimento, lieve profondità nella hero, transizioni fotografiche e supporto `prefers-reduced-motion`; in questa modalità le foto non avanzano automaticamente.
- Approfondimenti dimostrativi per le voci del menu che anticipano il futuro sito multipagina.

## Ambito

È una proposta visuale, non un sito operativo: nessun backend, account, pagamento, raccolta dati, verifica di disponibilità o invio automatico. I link email/telefono aprono le applicazioni dell’utente; l’invio resta una sua azione. Mappe e contatti richiedono applicazioni/servizi esterni.

Foto, logo e font sono inclusi e usano percorsi relativi. La visualizzazione e le interazioni locali funzionano anche offline; la cartografia OpenStreetMap richiede internet, come i collegamenti esterni. Per condividere la demo inviare **l’intera cartella**, eventualmente compressa, oppure un link dopo la futura pubblicazione.

## Contenuti e provenienza

Testi nuovi, basati sulle informazioni del sito esistente. Fotografie originali convertite in WebP; nessuna foto stock o generata. Nessun prezzo, recensione o nome di tipologia inventato. Le disponibilità del calendario sono esempi simulati, dichiarati come tali e non collegati all’inventario dell’hotel. La data 1284 indica la prima menzione storica, non l’inizio dell’attività alberghiera. Le immagini delle camere sono presentate come galleria di ambienti, non come catalogo prenotabile.

Font open source con licenze OFL nella cartella `assets/fonts`. Il logo riporta il payoff tedesco originale, mantenuto come parte dell’identità del marchio.

Fonti e decisioni in `docs/brief.md` e `docs/fonti-immagini.md`. Prima della fase operativa confermare informazioni commerciali, recapiti, classificazione delle camere, eventuali servizi condivisi con Panoramik e testi legali. Il sito attuale mostra il telefono +39 0472 849792, ma in un link usa il numero Panoramik: qui è stato usato il numero visibile di Kandelburg, da confermare per la pubblicazione.

La demo include `noindex, nofollow`; mantenere l’esclusione dall’indicizzazione finché rimane una proposta.

Leaflet 1.9.4 incluso in `assets/vendor/leaflet` con licenza BSD; cartografia attribuita a OpenStreetMap. WhatsApp usa il numero pubblico +39 349 2362220; Viber richiede l’app compatibile. L’apertura delle app di messaggistica non è stata eseguita nella verifica.

## Modulo soggiorno

I pulsanti Prenota e Informazioni sulle camere e le voci Richiesta e prenotazione aprono il modulo con date, adulti, bambini, camere, nome, email, telefono facoltativo e note. Le date, gli adulti e i bambini selezionati nella barra della homepage vengono riportati nel modulo. La richiesta è una simulazione locale: nessun invio, salvataggio o conferma commerciale.
