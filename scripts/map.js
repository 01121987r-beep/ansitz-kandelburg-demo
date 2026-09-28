
'use strict';
(() => {
  const container = document.getElementById('location-map');
  if (!container || !window.L) return;
  const position = [46.7964973, 11.6668539];
  const map = L.map(container, { scrollWheelZoom: false, zoomControl: false }).setView(position, 16);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  const pin = L.divIcon({className: 'kandelburg-map-pin', html: '<span aria-hidden="true">K</span>', iconSize: [42,42], iconAnchor: [21,42]});
  L.marker(position, {icon: pin, title: 'Ansitz Kandelburg', alt: 'Ansitz Kandelburg, Richtergasse 4'}).addTo(map)
    .bindPopup('<strong>Ansitz Kandelburg</strong><br>Richtergasse 4<br>39037 Rio di Pusteria', {closeButton: false}).openPopup();
  L.control.zoom({zoomInTitle: 'Ingrandisci la mappa', zoomOutTitle: 'Riduci la mappa'}).addTo(map);
  if ('ResizeObserver' in window) new ResizeObserver(() => map.invalidateSize({pan: false})).observe(container);
})();
