'use strict';

(() => {
  const inputs = [...document.querySelectorAll('input[type="date"]')];
  if (!inputs.length) return;
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = value => new Date(`${value}T12:00:00`);
  const shift = (value, n) => { const d = parse(value); d.setDate(d.getDate() + n); return iso(d); };
  const today = () => iso(new Date());
  const pretty = value => value ? parse(value).toLocaleDateString('it-IT', {day:'numeric', month:'short', year:'numeric'}) : 'Seleziona data';
  const statuses = {available:'Disponibile', limited:'Disponibilità limitata', last:'Ultime camere', unavailable:'Non disponibile', unknown:'Da verificare'};
  const media = matchMedia('(max-width: 620px)');
  const triggers = new Map();
  const dialog = document.createElement('dialog');
  dialog.id = 'stay-calendar';
  dialog.className = 'k-calendar';
  dialog.setAttribute('aria-labelledby', 'calendar-title');
  document.body.append(dialog);
  let active, month, returnFocus, loading = false, error = false, data = {}, mode = 'demo';
  let controller, sequence = 0;

  // Demonstration data only. A future backend replaces this provider, not the calendar UI.
  async function demoProvider({from, to}) {
    const days = {};
    for (let value = from; value <= to; value = shift(value, 1)) {
      const day = parse(value).getDate();
      days[value] = {status: [12,26].includes(day) ? 'unavailable' : day % 10 === 8 ? 'limited' : day % 10 === 9 ? 'last' : 'available'};
    }
    return {mode:'demo', days};
  }
  let provider = demoProvider;
  const pair = () => ({arrival:active.form.elements.arrival, departure:active.form.elements.departure});
  const minimum = () => {
    const arrival = pair().arrival.value;
    return [today(), active.min || '', active.name === 'departure' && arrival ? shift(arrival,1) : ''].sort().at(-1);
  };
  const monthCount = () => media.matches ? 1 : 2;
  const firstOfMonth = d => new Date(d.getFullYear(), d.getMonth(), 1, 12);
  const statusAt = value => data[value]?.status || 'unknown';
  function blocked(value) {
    if (loading || error || value < minimum() || (active.max && value > active.max)) return true;
    const {arrival} = pair();
    if (active.name === 'departure' && arrival.value) {
      // Availability applies to occupied nights; a sold-out day may still be a checkout date.
      for (let night = arrival.value; night < value; night = shift(night,1)) {
        if (['unavailable','unknown'].includes(statusAt(night))) return true;
      }
      return false;
    }
    return ['unavailable','unknown'].includes(statusAt(value));
  }
  function refresh() {
    inputs.forEach(input => {
      const button = triggers.get(input);
      button.querySelector('.calendar-field-value').textContent = pretty(input.value);
      button.classList.toggle('has-date', Boolean(input.value));
      button.setAttribute('aria-label', `${input.name === 'arrival' ? 'Arrivo' : 'Partenza'}: ${pretty(input.value)}`);
    });
  }
  function render(focusDate) {
    const {arrival, departure} = pair();
    dialog.innerHTML = `<header class="k-calendar-head"><div><p class="eyebrow">IL TUO SOGGIORNO IN DIMORA</p><h2 id="calendar-title">Scegli ${active.name === 'arrival' ? 'l’arrivo.' : 'la partenza.'}</h2></div><button class="k-calendar-close" type="button" aria-label="Chiudi calendario">×</button></header>
      <div class="k-calendar-selection"><button type="button" data-select-field="arrival" aria-pressed="${active.name === 'arrival'}"><small>ARRIVO</small><span>${pretty(arrival.value)}</span></button><button type="button" data-select-field="departure" aria-pressed="${active.name === 'departure'}"><small>PARTENZA</small><span>${pretty(departure.value)}</span></button></div>
      <div class="k-calendar-navigation"><button type="button" data-month-step="-1" aria-label="Mese precedente">‹</button><p aria-live="polite">${monthCount() === 2 ? 'Scegli le date del tuo soggiorno' : month.toLocaleDateString('it-IT',{month:'long',year:'numeric'})}</p><button type="button" data-month-step="1" aria-label="Mese successivo">›</button></div>
      <div class="k-calendar-months" aria-busy="${loading}"></div>
      <div class="k-calendar-legend" aria-label="Legenda disponibilità">${['available','limited','last','unavailable'].map(status=>`<span><i data-status="${status}" aria-hidden="true"></i>${statuses[status]}</span>`).join('')}<span><i class="selected-swatch" aria-hidden="true"></i>Date selezionate</span></div>
      <p class="k-calendar-notice" role="status">${loading ? 'Caricamento del calendario…' : error ? 'Non è stato possibile caricare le disponibilità. Riprova.' : mode === 'demo' ? 'Calendario dimostrativo: i colori sono esempi e non indicano disponibilità reali. Per conferma, contatta la dimora.' : 'Disponibilità aggiornate per gli ospiti selezionati. La richiesta non conferma la prenotazione.'}</p>
      ${error ? '<button class="button button-outline calendar-retry" type="button">Riprova</button>' : ''}`;
    const months = dialog.querySelector('.k-calendar-months');
    for (let offset=0; offset<monthCount(); offset++) {
      const current = new Date(month.getFullYear(), month.getMonth()+offset, 1, 12);
      const title = current.toLocaleDateString('it-IT',{month:'long',year:'numeric'});
      const section = document.createElement('section');
      section.className = 'k-calendar-month';
      section.setAttribute('aria-label', title);
      section.innerHTML = `<h3>${title}</h3><div class="k-calendar-weekdays" aria-hidden="true">${['L','M','M','G','V','S','D'].map(x=>`<span>${x}</span>`).join('')}</div><div class="k-calendar-days"></div>`;
      const grid = section.querySelector('.k-calendar-days');
      const blanks = (current.getDay()+6)%7;
      for (let i=0;i<blanks;i++) grid.append(document.createElement('span'));
      const total = new Date(current.getFullYear(),current.getMonth()+1,0).getDate();
      for (let day=1;day<=total;day++) {
        current.setDate(day);
        const value = iso(current), status = statusAt(value), button = document.createElement('button');
        button.type = 'button'; button.dataset.date = value; button.dataset.status = status; button.textContent = day;
        button.disabled = blocked(value);
        const checkoutOnly = active.name==='departure' && status==='unavailable' && !button.disabled;
        button.setAttribute('aria-label', `${current.toLocaleDateString('it-IT',{dateStyle:'full'})}, ${value < today() ? 'data passata' : statuses[status]}${checkoutOnly ? ', solo partenza' : ''}${mode==='demo' ? ', esempio' : ''}`);
        if (value < today()) button.classList.add('is-past');
        button.classList.toggle('is-selected',value===arrival.value || value===departure.value);
        button.classList.toggle('is-in-range',Boolean(arrival.value && departure.value && value>arrival.value && value<departure.value));
        button.setAttribute('aria-pressed',String(value===active.value));
        if(value===today()) button.setAttribute('aria-current','date');
        grid.append(button);
      }
      // Stable month heights avoid shifting the legend when switching months.
      for(let i=blanks+total;i<42;i++) grid.append(document.createElement('span'));
      months.append(section);
    }
    dialog.querySelector('[data-month-step="-1"]').disabled = iso(month).slice(0,7) <= minimum().slice(0,7);
    const enabled = [...dialog.querySelectorAll('[data-date]:not(:disabled)')];
    const target = enabled.find(e=>e.dataset.date===(focusDate || active.value)) || enabled[0];
    enabled.forEach(e=>e.tabIndex=e===target?0:-1);
    if(focusDate) (target || dialog.querySelector('.k-calendar-close')).focus({preventScroll:true});
  }
  async function load(focusDate) {
    controller?.abort(); controller = new AbortController(); const request = ++sequence;
    loading = true; error = false; data = {}; render();
    const {arrival} = pair();
    const from = active.name==='departure' && arrival.value ? [arrival.value,iso(month)].sort()[0] : iso(month);
    const to = iso(new Date(month.getFullYear(),month.getMonth()+monthCount(),0,12));
    const form = active.form;
    try {
      const result = await provider({from,to,adults:form.elements.adults?.value || '2',children:form.elements.children?.value || '0',rooms:form.elements.rooms?.value || '1',signal:controller.signal});
      if(request!==sequence || !dialog.open) return;
      if(!result || !['demo','live'].includes(result.mode) || !result.days || typeof result.days!=='object') throw new Error('Invalid availability response');
      for(const [key, record] of Object.entries(result.days)) if(!/^\d{4}-\d{2}-\d{2}$/.test(key) || !Object.hasOwn(statuses,record?.status)) throw new Error('Invalid availability day');
      data=result.days; mode=result.mode;
    } catch(err) {
      if(request!==sequence || err.name==='AbortError') return;
      error=true;
    } finally {
      if(request===sequence && dialog.open){loading=false;render(focusDate);}
    }
  }
  function open(input) {
    if(dialog.open) return;
    active=input; returnFocus=triggers.get(input);
    const initial = [input.value || minimum(), minimum()].sort().at(-1);
    month=firstOfMonth(parse(initial)); loading=true;render();
    document.body.classList.add('calendar-open');
    triggers.get(input).setAttribute('aria-expanded','true');
    dialog.showModal();
    void load(input.value || minimum());
  }
  function switchField(name) {
    triggers.get(active).setAttribute('aria-expanded','false');
    active=pair()[name]; returnFocus=triggers.get(active);
    triggers.get(active).setAttribute('aria-expanded','true');
    const min = minimum();
    if (iso(month).slice(0,7) < min.slice(0,7)) month=firstOfMonth(parse(min));
    void load(active.value || min);
  }
  inputs.forEach(input=>{
    const button=document.createElement('button'); button.type='button'; button.id=`${input.id}-picker`; button.className='calendar-field';
    button.innerHTML='<span class="calendar-field-value"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>';
    button.setAttribute('aria-haspopup','dialog');button.setAttribute('aria-controls',dialog.id);button.setAttribute('aria-expanded','false');
    input.insertAdjacentElement('afterend',button);input.classList.add('calendar-native');input.tabIndex=-1;input.setAttribute('aria-hidden','true');
    document.querySelector(`label[for="${input.id}"]`)?.setAttribute('for',button.id);
    triggers.set(input,button);
    button.addEventListener('click',()=>open(input));
    button.addEventListener('keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();open(input);}});
    input.addEventListener('input',refresh);input.addEventListener('change',refresh);
    input.addEventListener('invalid',event=>{event.preventDefault();if(!dialog.open)open(input);});
  });
  refresh();
  dialog.addEventListener('click',event=>{
    if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left || event.clientX>b.right || event.clientY<b.top || event.clientY>b.bottom)dialog.close();return;}
    if(event.target.closest('.k-calendar-close')){dialog.close();return;}
    if(event.target.closest('.calendar-retry')){void load(minimum());return;}
    const field=event.target.closest('[data-select-field]');if(field){switchField(field.dataset.selectField);return;}
    const step=event.target.closest('[data-month-step]');if(step && !step.disabled){month.setMonth(month.getMonth()+Number(step.dataset.monthStep));void load(iso(month));return;}
    const day=event.target.closest('[data-date]');if(!day || day.disabled || blocked(day.dataset.date))return;
    if(active.name==='arrival') pair().departure.value='';
    active.value=day.dataset.date;
    active.dispatchEvent(new Event('input',{bubbles:true}));active.dispatchEvent(new Event('change',{bubbles:true}));refresh();
    if(active.name==='arrival')switchField('departure');else dialog.close();
  });
  dialog.addEventListener('keydown',event=>{
    const focused=event.target.closest('[data-date]');if(!focused)return;
    const delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7}[event.key];
    if(delta===undefined)return;event.preventDefault();
    let value=shift(focused.dataset.date,delta);
    if(value<minimum())return;
    const target=dialog.querySelector(`[data-date="${value}"]`);
    if(!target){month=firstOfMonth(parse(value));void load(value);return;}
    const candidates=[...dialog.querySelectorAll('[data-date]:not(:disabled)')];
    const next=delta>0?candidates.find(e=>e.dataset.date>=value):candidates.reverse().find(e=>e.dataset.date<=value);
    if(next){dialog.querySelectorAll('[data-date]').forEach(e=>e.tabIndex=-1);next.tabIndex=0;next.focus({preventScroll:true});}
  });
  dialog.addEventListener('close',()=>{sequence++;controller?.abort();document.body.classList.remove('calendar-open');triggers.get(active)?.setAttribute('aria-expanded','false');returnFocus?.focus({preventScroll:true});});
  media.addEventListener('change',()=>{if(dialog.open)void load(active.value || minimum());});
  window.KandelburgCalendar=Object.freeze({refresh,setAvailabilityProvider(fn){if(typeof fn!=='function')throw new TypeError('Availability provider must be a function');provider=fn;if(dialog.open)void load(minimum());}});
})();
