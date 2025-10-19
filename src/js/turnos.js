// src/js/turnos.js
// MVP cliente para agendar turnos usando src/data/doctors.json y localStorage.
(function() {
  const STORAGE_KEY = 'swm_bookings_v1';

  const formatDate = d => d.toISOString().slice(0, 10);
  const formatTime = d => d.toTimeString().slice(0,5);

  async function loadDoctorsJson() {
    try {
      const res = await fetch('../data/doctors.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('no-json');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      const inline = document.getElementById('doctors-data');
      if (inline) {
        try { return JSON.parse(inline.textContent); } catch { return []; }
      }
      console.warn('No se pudo cargar doctors.json:', e);
      return [];
    }
  }

  function loadBookings() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } }
  function saveBookingLocal(b) { const all = loadBookings(); all.push(b); localStorage.setItem(STORAGE_KEY, JSON.stringify(all)); }

  function populateSpecialties(doctors, sel) {
    const set = Array.from(new Set(doctors.map(d => d.specialty))).sort();
    sel.innerHTML = '<option value="">-- Elija especialidad --</option>';
    set.forEach(s => { const o = document.createElement('option'); o.value = s; o.textContent = s; sel.appendChild(o); });
  }

  function populateDoctors(doctors, specialty, sel) {
    sel.innerHTML = '<option value="">-- Elija médico --</option>';
    const list = specialty ? doctors.filter(d => d.specialty === specialty) : doctors.slice();
    if (specialty) { const any = document.createElement('option'); any.value = 'ANY'; any.textContent = 'Cualquier doctor disponible'; sel.appendChild(any); }
    list.forEach(d => { const o = document.createElement('option'); o.value = d.id; o.textContent = `${d.name} — ${d.specialty}`; sel.appendChild(o); });
  }

  function getAvailableSlotsForDoctor(doctor, bookings) {
    const booked = new Set(bookings.filter(b => b.doctorId === doctor.id).map(b => b.slot));
    return (doctor.slots || []).filter(s => !booked.has(s));
  }

  function getAvailableSlotsForSpecialty(doctors, specialty, bookings) {
    const out = [];
    doctors.filter(d => d.specialty === specialty).forEach(d => {
      getAvailableSlotsForDoctor(d, bookings).forEach(slot => out.push({ doctorId: d.id, doctorName: d.name, slot }));
    });
    return out.sort((a,b) => a.slot.localeCompare(b.slot));
  }

  function renderSlots(doctors, selDoctor, selSpecialty, selDate, selTime, container) {
    const bookings = loadBookings(); container.innerHTML = ''; const doctorVal = selDoctor.value;
    if (!doctorVal) { container.innerHTML = '<div class="text-muted">Seleccione especialidad o médico para ver franjas.</div>'; return; }

    if (doctorVal === 'ANY') {
      const spec = selSpecialty.value; if (!spec) { container.innerHTML = '<div class="text-muted">Seleccione una especialidad para "Cualquier doctor".</div>'; return; }
      const items = getAvailableSlotsForSpecialty(doctors, spec, bookings); if (!items.length) { container.innerHTML = '<div class="text-warning">No hay franjas disponibles.</div>'; return; }
      const list = document.createElement('div'); list.className = 'list-group';
      items.forEach(it => {
        const dt = new Date(it.slot);
        const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
        btn.textContent = `${it.doctorName} — ${dt.toLocaleDateString()} ${formatTime(dt)}`;
        btn.addEventListener('click', () => { selDoctor.value = it.doctorId; selDate.value = it.slot.slice(0,10); selTime.value = it.slot.slice(11,16); container.innerHTML = `<div class="alert alert-success small">Seleccionado: ${it.doctorName} ${selDate.value} ${selTime.value}</div>`; });
        list.appendChild(btn);
      });
      container.appendChild(list); return;
    }

    const doc = doctors.find(d => d.id === doctorVal); if (!doc) { container.innerHTML = '<div class="text-danger">Médico no encontrado.</div>'; return; }
    const available = getAvailableSlotsForDoctor(doc, bookings); if (!available.length) { container.innerHTML = '<div class="text-warning">No hay franjas disponibles para este médico.</div>'; return; }

    const dateFilter = selDate.value; const wrap = document.createElement('div'); wrap.className = 'd-flex flex-wrap gap-2';
    available.forEach(slot => { if (dateFilter && slot.slice(0,10) !== dateFilter) return; const dt = new Date(slot); const b = document.createElement('button'); b.type = 'button'; b.className = 'btn btn-outline-primary btn-sm'; b.textContent = `${dt.toLocaleDateString()} ${formatTime(dt)}`; b.addEventListener('click', () => { selDate.value = slot.slice(0,10); selTime.value = slot.slice(11,16); container.innerHTML = `<div class="alert alert-success small">Seleccionado: ${doc.name} ${selDate.value} ${selTime.value}</div>`; }); wrap.appendChild(b); });
    container.appendChild(wrap);
  }

  function showAlert(form, msg, type='info') { let c = form.querySelector('.turnos-alert'); if (!c) { c = document.createElement('div'); c.className = 'turnos-alert mt-3'; form.appendChild(c); } c.innerHTML = `<div class="alert alert-${type}">${msg}</div>`; }

  async function init() {
    const form = document.getElementById('form-turnos'); if (!form) return; const doctors = await loadDoctorsJson();
    const selSpecialty = form.querySelector('[name="specialty"]');
    const selDoctor = form.querySelector('[name="doctorId"]');
    const selDate = form.querySelector('[name="date"]');
    const selTime = form.querySelector('[name="time"]');
    const slotsContainer = form.querySelector('#slots-container');

    populateSpecialties(doctors, selSpecialty);
    populateDoctors(doctors, '', selDoctor);
    selDate.value = formatDate(new Date());

    selSpecialty.addEventListener('change', () => { populateDoctors(doctors, selSpecialty.value, selDoctor); slotsContainer.innerHTML = ''; });
    selDoctor.addEventListener('change', () => { slotsContainer.innerHTML = ''; renderSlots(doctors, selDoctor, selSpecialty, selDate, selTime, slotsContainer); });
    selDate.addEventListener('change', () => { slotsContainer.innerHTML = ''; renderSlots(doctors, selDoctor, selSpecialty, selDate, selTime, slotsContainer); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="patientName"]').value.trim();
      const phone = form.querySelector('[name="patientPhone"]').value.trim();
      const date = selDate.value; const time = selTime.value; const specialty = selSpecialty.value || null; const doctorId = selDoctor.value || null;
      if (!name || !phone || !date || !time) { showAlert(form, 'Complete nombre, teléfono, fecha y hora.', 'danger'); return; }
      const booking = { id: 'b_' + Date.now(), doctorId, specialty, patientName: name, patientPhone: phone, slot: `${date}T${time}`, createdAt: new Date().toISOString() };
      saveBookingLocal(booking); showAlert(form, 'Turno guardado localmente en el navegador.', 'success'); form.reset(); selDate.value = formatDate(new Date()); slotsContainer.innerHTML = '';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

})();
// Simple MVP para agendar turnos usando src/data/doctors.json y localStorage.
// No hace llamadas a servidores externos ni referencias a PHP.

(() => {
  const STORAGE_KEY = 'swm_bookings_v1';

  const $ = (sel, root = document) => root.querySelector(sel);
  const formatDate = d => d.toISOString().slice(0, 10);
  const formatTime = d => d.toTimeString().slice(0,5);

  async function loadDoctorsJson() {
    try {
      const res = await fetch('../data/doctors.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('no-json');
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch {
      // fallback to inline data if present in page
      const inline = document.getElementById('doctors-data');
      if (inline) {
        try { return JSON.parse(inline.textContent); } catch { return []; }
      }
      return [];
    }
  }

  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function saveBookingLocal(b) {
    const all = loadBookings();
    all.push(b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function populateSpecialties(doctors, sel) {
    const set = Array.from(new Set(doctors.map(d => d.specialty))).sort();
    sel.innerHTML = '<option value="">-- Elija especialidad --</option>';
    set.forEach(s => {
      const o = document.createElement('option'); o.value = s; o.textContent = s; sel.appendChild(o);
    });
  }

  function populateDoctors(doctors, specialty, sel) {
    sel.innerHTML = '<option value="">-- Elija médico --</option>';
    const list = specialty ? doctors.filter(d => d.specialty === specialty) : doctors.slice();
    // opción para tomar "cualquier doctor" dentro de la especialidad
    if (specialty) {
      const any = document.createElement('option'); any.value = 'ANY'; any.textContent = 'Cualquier doctor disponible'; sel.appendChild(any);
    }
    list.forEach(d => {
      const o = document.createElement('option'); o.value = d.id; o.textContent = `${d.name} — ${d.specialty}`; sel.appendChild(o);
    });
  }

  function getAvailableSlotsForDoctor(doctor, bookings) {
    const booked = new Set(bookings.filter(b => b.doctorId === doctor.id).map(b => b.slot));
    return (doctor.slots || []).filter(s => !booked.has(s));
  }

  function getAvailableSlotsForSpecialty(doctors, specialty, bookings) {
    const out = [];
    doctors.filter(d => d.specialty === specialty).forEach(d => {
      getAvailableSlotsForDoctor(d, bookings).forEach(slot => out.push({ doctorId: d.id, doctorName: d.name, slot }));
    });
    return out.sort((a,b) => a.slot.localeCompare(b.slot));
  }

  function renderSlots(doctors, selDoctor, selSpecialty, selDate, selTime, container) {
    const bookings = loadBookings();
    container.innerHTML = '';
    const doctorVal = selDoctor.value;
    if (!doctorVal) { container.innerHTML = '<div class="text-muted">Seleccione especialidad o médico para ver franjas.</div>'; return; }

    if (doctorVal === 'ANY') {
      const spec = selSpecialty.value;
      if (!spec) { container.innerHTML = '<div class="text-muted">Seleccione una especialidad para "Cualquier doctor".</div>'; return; }
      const items = getAvailableSlotsForSpecialty(doctors, spec, bookings);
      if (!items.length) { container.innerHTML = '<div class="text-warning">No hay franjas disponibles.</div>'; return; }
      const list = document.createElement('div'); list.className = 'list-group';
      items.forEach(it => {
        const dt = new Date(it.slot);
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
        btn.textContent = `${it.doctorName} — ${dt.toLocaleDateString()} ${formatTime(dt)}`;
        btn.addEventListener('click', () => {
          selDoctor.value = it.doctorId;
          selDate.value = it.slot.slice(0,10);
          selTime.value = it.slot.slice(11,16);
          container.innerHTML = `<div class="alert alert-success small">Seleccionado: ${it.doctorName} ${selDate.value} ${selTime.value}</div>`;
        });
        list.appendChild(btn);
      });
      container.appendChild(list);
      return;
    }

    const doc = doctors.find(d => d.id === doctorVal);
    if (!doc) { container.innerHTML = '<div class="text-danger">Médico no encontrado.</div>'; return; }
    const available = getAvailableSlotsForDoctor(doc, bookings);
    if (!available.length) { container.innerHTML = '<div class="text-warning">No hay franjas disponibles para este médico.</div>'; return; }

    const dateFilter = selDate.value;
    const wrap = document.createElement('div'); wrap.className = 'd-flex flex-wrap gap-2';
    available.forEach(slot => {
      if (dateFilter && slot.slice(0,10) !== dateFilter) return;
      const dt = new Date(slot);
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn btn-outline-primary btn-sm';
      b.textContent = `${dt.toLocaleDateString()} ${formatTime(dt)}`;
      b.addEventListener('click', () => {
        selDate.value = slot.slice(0,10);
        selTime.value = slot.slice(11,16);
        container.innerHTML = `<div class="alert alert-success small">Seleccionado: ${doc.name} ${selDate.value} ${selTime.value}</div>`;
      });
      wrap.appendChild(b);
    });
    container.appendChild(wrap);
  }

  function showAlert(form, msg, type='info') {
    let c = form.querySelector('.turnos-alert');
    if (!c) { c = document.createElement('div'); c.className = 'turnos-alert mt-3'; form.appendChild(c); }
    c.innerHTML = `<div class="alert alert-${type}">${msg}</div>`;
  }

  async function init() {
    const form = document.getElementById('form-turnos'); if (!form) return;
    const doctors = await loadDoctorsJson();
    const selSpecialty = form.querySelector('[name="specialty"]');
    const selDoctor = form.querySelector('[name="doctorId"]');
    const selDate = form.querySelector('[name="date"]');
    const selTime = form.querySelector('[name="time"]');
    const slotsContainer = form.querySelector('#slots-container');

    populateSpecialties(doctors, selSpecialty);
    populateDoctors(doctors, '', selDoctor);
    selDate.value = formatDate(new Date());

    selSpecialty.addEventListener('change', () => {
      populateDoctors(doctors, selSpecialty.value, selDoctor);
      slotsContainer.innerHTML = '';
    });
    selDoctor.addEventListener('change', () => {
      slotsContainer.innerHTML = '';
      renderSlots(doctors, selDoctor, selSpecialty, selDate, selTime, slotsContainer);
    });
    selDate.addEventListener('change', () => {
      slotsContainer.innerHTML = '';
      renderSlots(doctors, selDoctor, selSpecialty, selDate, selTime, slotsContainer);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.querySelector('[name="patientName"]').value.trim();
      const phone = form.querySelector('[name="patientPhone"]').value.trim();
      const date = selDate.value;
      const time = selTime.value;
      const specialty = selSpecialty.value || null;
      const doctorId = selDoctor.value || null;

      if (!name || !phone || !date || !time) { showAlert(form, 'Complete nombre, teléfono, fecha y hora.', 'danger'); return; }

      const booking = {
        id: 'b_' + Date.now(),
        doctorId,
        specialty,
        patientName: name,
        patientPhone: phone,
        slot: `${date}T${time}`,
        createdAt: new Date().toISOString()
      };
      saveBookingLocal(booking);
      showAlert(form, 'Turno guardado localmente en el navegador.', 'success');
      form.reset();
      selDate.value = formatDate(new Date());
      slotsContainer.innerHTML = '';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();