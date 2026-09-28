'use strict';

(() => {
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intro = $('.intro');
  let introTimer;
  let cleanupTimer;
  let replayButton = null;

  function finishIntro() {
    clearTimeout(introTimer);
    clearTimeout(cleanupTimer);
    if (intro) intro.hidden = true;
    document.body.classList.remove('intro-active');
    $('.site-header').inert = false;
    $('main').inert = false;
    $('.site-footer').inert = false;
    if (replayButton) { replayButton.focus({ preventScroll: true }); replayButton = null; }
  }

  function closeIntro() {
    if (!intro) return;
    intro.classList.add('is-closing');
    document.body.classList.remove('intro-active');
    clearTimeout(introTimer);
    cleanupTimer = window.setTimeout(finishIntro, 700);
  }

  function showIntro(replay = false) {
    if (!intro || reducedMotion.matches) return;
    clearTimeout(introTimer);
    clearTimeout(cleanupTimer);
    intro.classList.remove('is-closing');
    intro.hidden = false;
    document.body.classList.add('intro-active');
    $('.site-header').inert = true;
    $('main').inert = true;
    $('.site-footer').inert = true;
    if (replay) replayButton = $('[data-replay-intro]');
    introTimer = window.setTimeout(finishIntro, 3300);
  }
  $('.intro-skip')?.addEventListener('click', closeIntro);
  $('[data-replay-intro]')?.addEventListener('click', () => showIntro(true));
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finishIntro(); });
  // A hash link should take visitors straight to the requested section.
  if (!window.location.hash) showIntro();

  const header = $('.site-header');
  const menuToggle = $('.menu-toggle');
  const mobileMenu = $('#mobile-menu');
  const langToggle = $('.language-toggle');
  const langMenu = $('#language-menu');
  const navTriggers = $$('.nav-trigger');
  function refreshHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > 45);
    header.classList.toggle('menu-open', !mobileMenu.hidden || !langMenu.hidden || navTriggers.some(button => button.getAttribute('aria-expanded') === 'true'));
  }
  function closeSubmenus() {
    navTriggers.forEach(button => { button.setAttribute('aria-expanded', 'false'); document.getElementById(button.getAttribute('aria-controls')).hidden = true; });
    refreshHeader();
  }
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false'); mobileMenu.hidden = true;
    $$('#mobile-menu details').forEach(detail => { detail.open = false; });
    closeSubmenus(); refreshHeader();
  }
  function closeLanguages() { langToggle.setAttribute('aria-expanded', 'false'); langMenu.hidden = true; refreshHeader(); }
  menuToggle.addEventListener('click', () => {
    const open = mobileMenu.hidden; closeLanguages(); closeSubmenus();
    mobileMenu.hidden = !open; menuToggle.setAttribute('aria-expanded', String(open)); refreshHeader();
  });
  navTriggers.forEach(button => button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true'; closeLanguages(); closeMenu();
    button.setAttribute('aria-expanded', String(open));
    document.getElementById(button.getAttribute('aria-controls')).hidden = !open; refreshHeader();
  }));
  $$('#mobile-menu a, .mega-links a, .desktop-nav > a').forEach(link => link.addEventListener('click', closeMenu));
  langToggle.addEventListener('click', () => {
    const open = langMenu.hidden; closeMenu(); langMenu.hidden = !open;
    langToggle.setAttribute('aria-expanded', String(open)); refreshHeader();
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.language-picker')) closeLanguages();
    if (!event.target.closest('.site-header')) closeMenu();
  });
  header.addEventListener('focusout', event => { if (event.relatedTarget && !header.contains(event.relatedTarget)) { closeMenu(); closeLanguages(); } });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (intro && !intro.hidden) closeIntro();
    const activeTrigger = navTriggers.find(button => button.getAttribute('aria-expanded') === 'true');
    if (activeTrigger) { closeSubmenus(); activeTrigger.focus(); }
    if (!mobileMenu.hidden) { closeMenu(); menuToggle.focus(); }
    if (!langMenu.hidden) { closeLanguages(); langToggle.focus(); }
  });
  window.matchMedia('(min-width: 1101px)').addEventListener('change', closeMenu);
  let scrolling = false;
  window.addEventListener('scroll', () => {
    if (scrolling) return; scrolling = true;
    requestAnimationFrame(() => {
      refreshHeader();
      if (!reducedMotion.matches && window.scrollY < innerHeight) $('.hero')?.style.setProperty('--hero-offset', `${Math.min(window.scrollY * .12, 85)}px`);
      scrolling = false;
    });
  }, { passive: true });
  refreshHeader();

  if ($('.hero')) {
  const heroSlides = $$('.hero-slide');
  const heroButtons = $$('[data-hero-slide]');
  let heroIndex = 0;
  let heroPaused = reducedMotion.matches;
  let heroTimer;
  function selectHero(index) {
    heroIndex = index;
    heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    heroButtons.forEach((button, i) => { button.classList.toggle('is-active', i === index); button.setAttribute('aria-pressed', String(i === index)); });
  }
  function scheduleHero() {
    clearInterval(heroTimer);
    if (!heroPaused && !reducedMotion.matches && !document.hidden) heroTimer = setInterval(() => {
      if (intro.hidden && window.scrollY < innerHeight && !document.querySelector('dialog[open]') && !header.classList.contains('menu-open')) selectHero((heroIndex + 1) % heroSlides.length);
    }, 7000);
  }
  heroButtons.forEach(button => button.addEventListener('click', () => { selectHero(Number(button.dataset.heroSlide)); scheduleHero(); }));
  document.addEventListener('visibilitychange', scheduleHero);
  reducedMotion.addEventListener('change', () => { heroPaused = reducedMotion.matches; scheduleHero(); });
  scheduleHero();

  }

  const roomCarousel = $('.room-carousel');
  if (roomCarousel) {
    const roomPhotos = [
      { src: 'kandelburg-camera-baldacchino.webp', alt: 'Camera con baldacchino, arredi color avorio e salottino', label: 'IL FASCINO DEL BALDACCHINO' },
      { src: 'kandelburg-camera-rossa.webp', alt: 'Camera con testiera in velluto rosso e dettagli dorati', label: 'IL CARATTERE DEL VELLUTO' },
      { src: 'kandelburg-camera-luminosa.webp', alt: 'Camera luminosa con testiera avorio e pareti color salvia', label: 'LA LUCE, LA QUIETE' }
    ];
    const roomButtons = $$('[data-room-slide]');
    let roomIndex = 0;
    let startPoint = null;
    let suppressClickUntil = 0;
    function showRoom(index) {
      roomIndex = (index + roomPhotos.length) % roomPhotos.length;
      const photo = roomPhotos[roomIndex];
      $('#room-carousel-image').src = `assets/images/${photo.src}`;
      $('#room-carousel-image').alt = photo.alt;
      $('.room-stage').dataset.gallery = String(roomIndex);
      roomButtons.forEach((button, i) => { button.classList.toggle('is-active', i === roomIndex); button.setAttribute('aria-pressed', String(i === roomIndex)); });
      if (!reducedMotion.matches) $('#room-carousel-image').animate([{ opacity: .35 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
    }
    roomButtons.forEach(button => button.addEventListener('click', () => showRoom(Number(button.dataset.roomSlide))));
    $('[data-room-prev]').addEventListener('click', () => showRoom(roomIndex - 1));
    $('[data-room-next]').addEventListener('click', () => showRoom(roomIndex + 1));
    roomCarousel.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); showRoom(roomIndex + 1); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); showRoom(roomIndex - 1); }
    });
    const stage = $('.room-stage');
    stage.addEventListener('pointerdown', event => { startPoint = { x: event.clientX, y: event.clientY }; });
    stage.addEventListener('pointerup', event => {
      if (!startPoint) return;
      const dx = event.clientX - startPoint.x, dy = event.clientY - startPoint.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { showRoom(roomIndex + (dx < 0 ? 1 : -1)); suppressClickUntil = Date.now() + 400; }
      startPoint = null;
    });
    stage.addEventListener('pointercancel', () => { startPoint = null; });
    stage.addEventListener('click', event => { if (Date.now() < suppressClickUntil) { event.preventDefault(); event.stopImmediatePropagation(); } }, true);
    stage.querySelector('img').draggable = false;
  }

  const seasons = {
    estate: { image: 'rio-di-pusteria-panorama.webp', alt: 'Il paesaggio verde di Rio di Pusteria', kicker: 'ESTATE AL FRESCO', title: 'Respira la montagna.', text: 'Sentieri, paesaggi aperti e il piacere di fermarsi. Il lato più verde dell’Alto Adige, al tuo ritmo.' },
    autunno: { image: 'alto-adige-autunno.webp', alt: 'Vino, uva e prodotti altoatesini su una tavola autunnale', kicker: 'AUTUNNO D’ORO', title: 'Il tempo dei sapori.', text: 'Il vino, le castagne e la tradizione del Törggelen. Un invito a scoprire l’Alto Adige attraverso i suoi sapori.' },
    inverno: { image: 'alto-adige-inverno.webp', alt: 'Paesaggio innevato sulle montagne altoatesine', kicker: 'NEVE, SCI E ATMOSFERA', title: 'La magia dell’inverno.', text: 'Montagne innevate, giornate all’aria aperta e l’atmosfera dei mercatini di Natale. Poi, il piacere di tornare nella dimora.' },
    primavera: { image: 'alto-adige-primavera.webp', alt: 'Albero in fiore e paesaggio verde tra le montagne', kicker: 'PRIMAVERA E FIORITURA', title: 'Tutto ricomincia.', text: 'La valle torna verde, le giornate si allungano. Il momento di una passeggiata, di una scoperta, di un nuovo soggiorno.' }
  };
  const seasonButtons = $$('[data-season]');
  function selectSeason(key) {
    const season = seasons[key];
    $('#season-image').src = `assets/images/${season.image}`; $('#season-image').alt = season.alt;
    $('#season-kicker').textContent = season.kicker; $('#season-title').textContent = season.title; $('#season-text').textContent = season.text;
    $('#season-panel').setAttribute('aria-labelledby', `tab-${key}`);
    seasonButtons.forEach(button => { const active = button.dataset.season === key; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
    if (!reducedMotion.matches) $('.season-copy').animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 400, easing: 'ease-out' });
  }
  seasonButtons.forEach((button, i) => {
    button.addEventListener('click', () => selectSeason(button.dataset.season));
    button.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (i + 1) % seasonButtons.length;
      if (event.key === 'ArrowLeft') next = (i + seasonButtons.length - 1) % seasonButtons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = seasonButtons.length - 1;
      if (next !== undefined) { event.preventDefault(); seasonButtons[next].focus(); selectSeason(seasonButtons[next].dataset.season); }
    });
  });
  $$('[data-season-link]').forEach(link => link.addEventListener('click', () => selectSeason(link.dataset.seasonLink)));

  const requestedSeason = new URLSearchParams(location.search).get('stagione');
  if ($('#season-panel') && Object.hasOwn(seasons, requestedSeason)) selectSeason(requestedSeason);

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    document.body.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    $$('.reveal').forEach(element => observer.observe(element));
  }

  const gallery = $('.gallery-dialog');
  const inquiry = $('.inquiry-dialog');
  const photos = [
    { src: 'assets/images/kandelburg-camera-baldacchino.webp', alt: 'Camera con baldacchino, arredi color avorio e salottino', title: 'Il fascino del baldacchino' },
    { src: 'assets/images/kandelburg-camera-rossa.webp', alt: 'Testiera in velluto rosso e dettagli dorati in una camera Kandelburg', title: 'Il carattere dei dettagli' },
    { src: 'assets/images/kandelburg-camera-luminosa.webp', alt: 'Camera luminosa con testiera bianca e pareti color salvia', title: 'La luce, la quiete' }
  ];
  let photoIndex = 0;
  function showPhoto(index) {
    photoIndex = (index + photos.length) % photos.length;
    $('#gallery-image').src = photos[photoIndex].src;
    $('#gallery-image').alt = photos[photoIndex].alt;
    $('#gallery-caption').textContent = photos[photoIndex].title;
  }
  function openDialog(dialog) {
    closeLanguages(); closeMenu();
    if (dialog === inquiry) $('#booking-result').hidden = true;
    dialog.showModal();
    document.body.classList.add('modal-open');
  }
  $$('[data-gallery]').forEach(button => button.addEventListener('click', () => { showPhoto(Number(button.dataset.gallery)); openDialog(gallery); }));
  $('[data-gallery-prev]').addEventListener('click', () => showPhoto(photoIndex - 1));
  $('[data-gallery-next]').addEventListener('click', () => showPhoto(photoIndex + 1));
  gallery.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(photoIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(photoIndex - 1); }
  });
  $$('dialog').forEach(dialog => {
    dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) document.body.classList.remove('modal-open'); });
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  });
  $$('[data-open-inquiry]').forEach(button => button.addEventListener('click', () => { $('#stay-summary').hidden = true; openDialog(inquiry); }));

  const topics = {
    storia: { title: 'Storie dentro la storia.', text: 'La prima menzione di Kandelburg risale al 1284. Nel tempo, le sue stanze hanno accolto famiglie nobiliari e vicende tramandate tra storia e leggenda. Nel futuro sito, questo spazio accompagnerà alla scoperta della dimora e dei suoi racconti.' },
    offerte: { title: 'Il soggiorno che immagini.', text: 'Raccontaci il periodo, il numero di ospiti e i tuoi desideri. La dimora potrà indicarti camere, tariffe e proposte disponibili per il tuo soggiorno. In questa anteprima non sono presenti offerte o prezzi prenotabili.' },
    mobilita: { title: 'In viaggio, con leggerezza.', text: 'Kandelburg si trova a Rio di Pusteria, in Alto Adige. Per organizzare l’arrivo in treno o autobus e conoscere i collegamenti adatti al tuo itinerario, contatta la dimora.' },
    aeroporti: { title: 'Il tuo arrivo in Alto Adige.', text: 'Il viaggio comincia prima del soggiorno. Indica l’aeroporto e l’orario di arrivo: potrai chiedere alla dimora informazioni per raggiungere Rio di Pusteria.' },
    taxi: { title: 'L’ultimo tratto, senza pensieri.', text: 'Hai bisogno di informazioni su taxi o trasferimenti? Contatta la dimora per valutare il percorso di arrivo. Disponibilità, modalità e costi devono essere concordati direttamente.' },
    castagnate: { title: 'Il gusto dello stare insieme.', text: 'Il Törggelen incontra il carattere delle cantine di Kandelburg. Castagne, vino e convivialità raccontano una tradizione altoatesina da ritrovare in autunno. Chiedi alla dimora informazioni sulle occasioni disponibili.' },
    incontri: { title: 'Un incontro da ricordare.', text: 'Celebrazioni, seminari e momenti da condividere: Kandelburg offre il carattere di una dimora storica come cornice per stare insieme. Contatta la struttura per discutere spazi, organizzazione e disponibilità.' }
  };
  $$('[data-topic]').forEach(button => button.addEventListener('click', () => {
    const topic = topics[button.dataset.topic]; $('#topic-title').textContent = topic.title; $('#topic-text').textContent = topic.text; openDialog($('.topic-dialog'));
  }));
  $('[data-topic-contact]').addEventListener('click', () => { $('.topic-dialog').close(); $('#stay-summary').hidden = true; openDialog(inquiry); });

  const bookingForm = $('#booking-form');
  const bookingArrival = $('#booking-arrival');
  const bookingDeparture = $('#booking-departure');
  const dateValue = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  bookingArrival.min = dateValue(new Date());
  function updateBookingDeparture() {
    const start = new Date(`${bookingArrival.value || bookingArrival.min}T12:00:00`);
    start.setDate(start.getDate() + 1);
    bookingDeparture.min = dateValue(start);
    bookingDeparture.setCustomValidity('');
    if (bookingDeparture.value && bookingDeparture.value < bookingDeparture.min) bookingDeparture.value = '';
  }
  bookingArrival.addEventListener('change', updateBookingDeparture);
  bookingDeparture.addEventListener('input', () => bookingDeparture.setCustomValidity(''));
  updateBookingDeparture();
  bookingForm.addEventListener('input', () => { $('#booking-result').hidden = true; $('#stay-summary').hidden = true; });
  bookingForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    if (bookingDeparture.value <= bookingArrival.value) {
      bookingDeparture.setCustomValidity('La partenza deve essere successiva all’arrivo.');
      bookingDeparture.reportValidity(); return;
    }
    const prettyDate = value => new Date(`${value}T12:00:00`).toLocaleDateString('it-IT', {day:'numeric',month:'long',year:'numeric'});
    const result = $('#booking-result');
    result.textContent = `Anteprima della richiesta: ${prettyDate(bookingArrival.value)} – ${prettyDate(bookingDeparture.value)}, ${$('#booking-guests').selectedOptions[0].textContent}, ${$('#booking-rooms').selectedOptions[0].textContent}. Nessun messaggio è stato inviato e nessuna prenotazione è stata effettuata. Per prenotare, contatta info@ansitz.org.`;
    result.hidden = false;
    result.focus();
  });

  if ($('#stay-form')) {
  const arrival = $('#arrival');
  const departure = $('#departure');
  const formatDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  arrival.min = formatDate(today);
  function setDepartureMin() {
    const firstNight = arrival.value ? new Date(`${arrival.value}T12:00:00`) : new Date(today);
    firstNight.setDate(firstNight.getDate() + 1);
    departure.min = formatDate(firstNight);
    if (departure.value && departure.value < departure.min) departure.value = '';
  }
  arrival.addEventListener('change', setDepartureMin);
  setDepartureMin();
  $('#stay-form').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    if (departure.value <= arrival.value) { departure.setCustomValidity('La partenza deve essere successiva all’arrivo.'); departure.reportValidity(); return; }
    departure.setCustomValidity('');
    const italianDate = value => new Date(`${value}T12:00:00`).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#stay-summary').textContent = `${italianDate(arrival.value)} — ${italianDate(departure.value)} · ${$('#guests').selectedOptions[0].textContent}`;
    $('#stay-summary').hidden = false;
    bookingArrival.value = arrival.value;
    updateBookingDeparture();
    bookingDeparture.value = departure.value;
    $('#booking-guests').selectedIndex = $('#guests').selectedIndex;
    openDialog(inquiry);
  });
  departure.addEventListener('input', () => departure.setCustomValidity(''));
  }
})();
