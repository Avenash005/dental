/* ═══════════════════════════════════════════
   Krishna Dental Clinic — booking.js
   Multi-step appointment form logic
   ═══════════════════════════════════════════ */

// ── State ──
const booking = {
  service:  '',
  date:     '',
  time:     '',
  name:     '',
  phone:    '',
  message:  '',
};

/* ─────────────────────────────────────
   Step navigation
───────────────────────────────────── */
function showStep(n) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById('step' + n)?.classList.add('active');
  updateStepsBar(n);
}

function updateStepsBar(activeStep) {
  const steps = document.querySelectorAll('.step');
  const lines = document.querySelectorAll('.step-line');

  steps.forEach((step, i) => {
    const stepNum = i + 1;
    step.classList.remove('active', 'done');
    if (stepNum < activeStep) step.classList.add('done');
    else if (stepNum === activeStep) step.classList.add('active');
  });

  lines.forEach((line, i) => {
    line.classList.toggle('done', i + 1 < activeStep);
  });
}

/* ─────────────────────────────────────
   Validation helpers
───────────────────────────────────── */
function showError(id, show) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !show);
}

function clearErrors(...ids) {
  ids.forEach(id => showError(id, false));
}

/* ─────────────────────────────────────
   Step 1 → 2: Validate service
───────────────────────────────────── */
function nextStep(from) {
  if (from === 1) {
    const checked = document.querySelector('input[name="service"]:checked');
    if (!checked) { showError('err-service', true); return; }
    clearErrors('err-service');
    booking.service = checked.value;
    showStep(2);
    // Set min date to today
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
    return;
  }

  if (from === 2) {
    const dateInput  = document.getElementById('appointmentDate');
    const dateVal    = dateInput?.value;
    const selectedTime = document.querySelector('.time-slot.selected');

    let valid = true;
    clearErrors('err-date', 'err-time');

    if (!dateVal) { showError('err-date', true); valid = false; }
    if (!selectedTime) { showError('err-time', true); valid = false; }

    if (!valid) return;

    booking.date = formatDate(dateVal);
    booking.time = selectedTime.dataset.time;
    showStep(3);
    renderSummary();
    return;
  }
}

function prevStep(from) {
  showStep(from - 1);
}

/* ─────────────────────────────────────
   Time slot selection
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  document.querySelectorAll('.time-slot').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      showError('err-time', false);
    });
  });

  // Clear service error on selection
  document.querySelectorAll('input[name="service"]').forEach(radio => {
    radio.addEventListener('change', () => showError('err-service', false));
  });

});

/* ─────────────────────────────────────
   Booking summary render
───────────────────────────────────── */
function renderSummary() {
  const el = document.getElementById('bookingSummary');
  if (!el) return;
  el.innerHTML = `
    <div class="bs-title">📋 Appointment Summary</div>
    <div class="bs-row"><span>Service</span><span>${booking.service}</span></div>
    <div class="bs-row"><span>Date</span><span>${booking.date}</span></div>
    <div class="bs-row"><span>Time</span><span>${booking.time}</span></div>
  `;
}

/* ─────────────────────────────────────
   Step 3 → Submit
───────────────────────────────────── */
function submitBooking() {
  const nameInput  = document.getElementById('patientName');
  const phoneInput = document.getElementById('patientPhone');
  const msgInput   = document.getElementById('patientMsg');

  clearErrors('err-name', 'err-phone');
  let valid = true;

  const name  = nameInput?.value.trim();
  const phone = phoneInput?.value.trim();

  if (!name) { showError('err-name', true); valid = false; }
  if (!phone || !/^\d{10}$/.test(phone)) { showError('err-phone', true); valid = false; }

  if (!valid) return;

  booking.name    = name;
  booking.phone   = phone;
  booking.message = msgInput?.value.trim() || '';

  // Show loading state
  const btn = document.getElementById('submitBtn');
  if (btn) {
    btn.textContent = 'Sending…';
    btn.disabled = true;
  }

  // Simulate API call (replace with real endpoint)
  setTimeout(() => {
    const successMsg = document.getElementById('successMsg');
    if (successMsg) {
      successMsg.textContent =
        `Thank you, ${booking.name}! Your appointment request for ${booking.service} on ${booking.date} at ${booking.time} has been received.`;
    }
    showStep('Success');
  }, 1400);
}

/* ─────────────────────────────────────
   Reset form
───────────────────────────────────── */
function resetForm() {
  // Clear state
  Object.keys(booking).forEach(k => booking[k] = '');

  // Reset inputs
  document.querySelectorAll('input[name="service"]').forEach(r => r.checked = false);
  const dateInput = document.getElementById('appointmentDate');
  if (dateInput) dateInput.value = '';
  document.querySelectorAll('.time-slot').forEach(b => b.classList.remove('selected'));
  const nameInput  = document.getElementById('patientName');
  const phoneInput = document.getElementById('patientPhone');
  const msgInput   = document.getElementById('patientMsg');
  if (nameInput)  nameInput.value = '';
  if (phoneInput) phoneInput.value = '';
  if (msgInput)   msgInput.value = '';

  // Reset submit button
  const btn = document.getElementById('submitBtn');
  if (btn) { btn.textContent = 'Confirm Appointment ✓'; btn.disabled = false; }

  // Go back to step 1
  showStep(1);
}

/* ─────────────────────────────────────
   Helper: format date nicely
───────────────────────────────────── */
function formatDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}