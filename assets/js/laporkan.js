function toggleChip(el) {
  el.classList.toggle('active');
  const selected = [...document.querySelectorAll('.error-chip.active')].map(c => c.textContent);
  document.getElementById('jenisKesalahan').value = selected.join(', ');
}

function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('reportForm').style.display = 'none';
  document.getElementById('formSuccess').style.display = 'block';
}

function resetForm() {
  document.getElementById('reportForm').reset();
  document.querySelectorAll('.error-chip').forEach(c => c.classList.remove('active'));
  document.getElementById('jenisKesalahan').value = '';
  document.getElementById('reportForm').style.display = 'block';
  document.getElementById('formSuccess').style.display = 'none';
}
