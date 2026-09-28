'use strict';

(() => {
  const $ = selector => document.querySelector(selector);
  const chatPanel = $('#chat-panel');
  const messages = $('#chat-messages');
  const messagingPanel = $('#messaging-panel');
  const chatToggle = $('.chat-toggle');
  const messagingToggle = $('.messaging-toggle');
  const input = $('#chat-input');

  function closeMessaging(restoreFocus = false) {
    messagingPanel.hidden = true;
    messagingToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) messagingToggle.focus();
  }
  function closeChat(restoreFocus = false) {
    chatPanel.hidden = true;
    chatToggle.setAttribute('aria-expanded', 'false');
    if (restoreFocus) chatToggle.focus();
  }
  messagingToggle.addEventListener('click', () => {
    const opening = messagingPanel.hidden;
    closeChat();
    messagingPanel.hidden = !opening;
    messagingToggle.setAttribute('aria-expanded', String(opening));
    if (opening) messagingPanel.querySelector('a').focus({ preventScroll: true });
  });
  chatToggle.addEventListener('click', () => {
    const opening = chatPanel.hidden;
    closeMessaging();
    chatPanel.hidden = !opening;
    chatToggle.setAttribute('aria-expanded', String(opening));
    if (opening) input.focus({ preventScroll: true });
  });
  $('[data-close-messaging]').addEventListener('click', () => closeMessaging(true));
  $('[data-close-chat]').addEventListener('click', () => closeChat(true));
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (!chatPanel.hidden) { event.preventDefault(); closeChat(true); }
    if (!messagingPanel.hidden) { event.preventDefault(); closeMessaging(true); }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.floating-assistance')) closeMessaging();
    if (event.target.closest('.menu-toggle, .nav-trigger, [data-open-inquiry], [data-gallery]')) closeChat();
  });

  function addMessage(text, author) {
    const message = document.createElement('p');
    message.className = `chat-message ${author}-message`;
    message.textContent = text;
    messages.append(message);
    // Keep the demonstration lightweight without storing a conversation anywhere.
    while (messages.children.length > 30) messages.firstElementChild.remove();
    messages.scrollTop = messages.scrollHeight;
  }
  function answerFor(question) {
    const text = question.toLocaleLowerCase('it').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (/prezz|tariff|cost|offert|disponib|prenot|soggiorn/.test(text)) return 'Per tariffe e disponibilità occorre contattare la dimora: info@ansitz.org oppure +39 0472 849792. Questa chat dimostrativa non consulta disponibilità e non effettua prenotazioni.';
    if (/camera|camere|stanza|stanze|suite|baldacchin/.test(text)) return 'Le camere di Kandelburg hanno architetture, arredi e colori diversi. Portano dediche a figure della storia della dimora. Puoi esplorare tre ambienti nella galleria; per dotazioni specifiche e scelta della camera, scrivi a info@ansitz.org.';
    if (/dove|arriv|mappa|indirizz|raggiung|parchegg|taxi|treno/.test(text)) return 'Ansitz Kandelburg si trova in Richtergasse 4, 39037 Rio di Pusteria, in Alto Adige. La pagina Contatti contiene la mappa. Per parcheggio, trasferimenti e indicazioni personalizzate, chiedi direttamente alla struttura.';
    if (/stori|castell|1284|dimora/.test(text)) return 'Kandelburg è menzionata per la prima volta nel 1284. Affreschi, salotti e arredi raccontano il carattere di una dimora storica nel cuore di Rio di Pusteria.';
    if (/event|seminar|fest|celebra|torgg|castagn/.test(text)) return 'Il sito della dimora presenta celebrazioni, incontri e convivialità nelle cantine storiche, anche legati alla tradizione del Törggelen. Date, organizzazione e disponibilità vanno concordate direttamente con la struttura.';
    if (/contatt|telefono|email|mail|whatsapp|viber/.test(text)) return 'Puoi scrivere a info@ansitz.org o telefonare al +39 0472 849792. Per WhatsApp e Viber il numero indicato è +39 349 2362220: trovi i collegamenti nel pulsante dei contatti rapidi.';
    if (/ciao|salve|buongiorno|buonasera/.test(text)) return 'Benvenuto! Posso aiutarti a esplorare camere, storia e contatti di Kandelburg. Per richieste personali o prenotazioni, la dimora ti risponderà direttamente.';
    if (/grazie/.test(text)) return 'Con piacere. Se desideri parlare con la dimora, trovi i recapiti nella pagina Contatti e nei pulsanti WhatsApp/Viber.';
    return 'Questa anteprima risponde soltanto a domande generali su camere, storia, arrivo e contatti. Per questa richiesta ti consiglio di scrivere a info@ansitz.org: la dimora potrà darti informazioni precise.';
  }
  function sendQuestion(question) {
    const text = question.trim().slice(0, 500);
    if (!text) return;
    addMessage(text, 'user');
    addMessage(answerFor(text), 'assistant');
    input.value = '';
  }
  $('#chat-form').addEventListener('submit', event => { event.preventDefault(); sendQuestion(input.value); });
  document.querySelectorAll('[data-chat-question]').forEach(button => button.addEventListener('click', () => sendQuestion(button.dataset.chatQuestion)));

  const contactForm = $('#contact-form');
  if (contactForm) contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const result = $('#contact-form-result');
    result.hidden = false;
    result.textContent = 'Anteprima completata. Nessun messaggio è stato inviato e nessun dato è stato salvato. Per contattare realmente la dimora, scrivi a info@ansitz.org.';
  });
})();
