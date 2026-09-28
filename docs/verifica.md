# Verifica — 28 settembre 2026

- HTML controllato con parse5: nessun errore di parsing.
- JavaScript controllato con `node --check`: nessun errore sintattico.
- ID univoci, destinazioni delle ancore e percorsi degli asset verificati.
- Browser integrato: controlli a 320, 390, 768, 1024 e 1440 px; nessun overflow orizzontale rilevato.
- Ispezione visiva desktop: hero, dimora, esperienze, territorio e dialogo soggiorno. Ispezione mobile: hero, camere e galleria.
- Menu mobile: apertura, navigazione e chiusura dopo selezione verificati.
- Selettore lingua: IT corrente, DE/EN disabilitati con indicazione di disponibilità futura.
- Galleria: avanzamento tra le tre immagini e chiusura con Escape verificati; fotografia alternativa e didascalia aggiornate.
- Date di prova: 14–17 ottobre 2026; il dialogo mostra il riepilogo con 2 ospiti. Nessuna richiesta inviata all’hotel.
- Font caricati, immagini osservate caricate correttamente; licenze OFL presenti e verificate.
- Console del sito: nessun errore o avviso rilevato.
- Preferenza di movimento ridotto gestita sia nel CSS sia nello script; nessuna modifica alle preferenze di sistema durante la verifica.

La verifica copre una demo statica nel browser integrato. Le funzionalità commerciali reali e le traduzioni sono escluse da questa fase.

## Revisione dinamica

- Header trasparente alla sommità e colorato allo scorrimento, con logo chiaro/scuro coerente.
- Menu Albergo, Servizio, Eventi, Stagioni: apertura verificata; chiusura con Escape. Sottomenu mobile Albergo, navigazione Camere e chiusura automatica verificati.
- Approfondimento Storia e leggende e passaggio alla richiesta soggiorno verificati; il blocco dello scroll resta attivo durante il cambio di dialogo.
- Fotografie hero: selezione manuale, avanzamento osservato e pulsante Pausa/Riprendi verificati.
- Camere: selezione La luce e Il velluto, scorrimento fotografico e stato dei pulsanti verificati.
- Stagioni: selezione da menu, cambio Autunno/Inverno e navigazione con tastiera verificati.
- Larghezze 320, 390, 768, 1100, 1280 e 1440 px: nessun overflow della pagina.
- Controlli statici su sintassi, asset, ID, ancore, aria-controls e assenza di frecce decorative completati. Console priva di errori e avvisi.

## Revisione camere, contatti e assistenza

- Homepage e Contatti: ID, ancore interne e tra pagine, aria-controls e asset verificati; script senza errori sintattici.
- Larghezze 320, 390, 768 e 1440 px: nessun overflow orizzontale della pagina rilevato.
- Camere: avanzamento 01/03 → 02/03, apertura della foto corrente nella galleria e chiusura verificati su desktop; avanzamento verificato su mobile.
- Contatti: navigazione dalla homepage, compilazione con dati fittizi e risposta dimostrativa senza invio verificati.
- Mappa: incorporamento tramite Leaflet con cartografia OpenStreetMap caricata e zoom verificato; segnaposto dalla posizione restituita dal servizio cartografico per la struttura. Link esterno alle indicazioni Google Maps disponibile.
- Chat: apertura e chiusura, domanda rapida sulle camere e risposta di rinvio ai recapiti per una domanda non prevista verificate; nessuna AI o trasmissione di messaggi.
- WhatsApp/Viber: apertura del pannello e destinazioni dei collegamenti verificate senza lanciare conversazioni.
- Fotografie rettangolari, X senza cerchio e footer con link testuali controllati.
- Console delle due pagine: nessun errore o avviso del sito rilevato.

## Modulo prenotazione

Apertura da Prenota e Immagina il tuo soggiorno verificata; apertura anche sulla pagina Contatti. Compilazione con dati fittizi e riepilogo dimostrativo verificati. Trasferimento dalla barra homepage di arrivo 10/11/2026, partenza 13/11/2026 e 3 ospiti verificato. Modulo controllato a 1440 e 390 px, senza overflow; chiusura disponibile senza cerchio. Nessun errore di parsing HTML o console.

## Richiesta diretta e composizione soggiorno

Testi aggiornati, campi Adulti/Bambini e pulsante centrato. Verifica mobile a 390 px e desktop a 1440 px. Date 14–17 ottobre 2026, 2 adulti e 2 bambini trasferiti al modulo e riportati nel riepilogo dimostrativo. HTML e sintassi JavaScript validati.

## Calendario personalizzato — 28 settembre 2026

- Calendario a due mesi su desktop e un mese a 390/320 px; nessun overflow orizzontale rilevato. Ispezione visiva desktop e mobile completata.
- Selezione 14–17 ottobre dalla barra e trasferimento al modulo verificati. L’arrivo passa automaticamente alla scelta della partenza.
- Disponibilità simulate: il 12 ottobre è disabilitato come arrivo. Con arrivo il 10, partenza il 12 consentita, il 13 e il 14 disabilitati perché attraversano una notte indisponibile.
- Navigazione con frecce della tastiera verificata. Escape chiude il calendario, mantiene aperto il modulo sottostante e restituisce il focus al campo data.
- Nella pagina Contatti l’invio del modulo vuoto apre il calendario sul primo campo data obbligatorio.
- Nessun invio all’hotel o verifica di inventario reale: colori, disponibilità e risposta del modulo sono dimostrativi.
