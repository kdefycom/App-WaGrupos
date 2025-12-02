
document.addEventListener('DOMContentLoaded', () => {
  popularCategorias();
  setupCharCounter();

  document.getElementById('linkInput').addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(validarLinkEmTempoReal, 500);
  });

  const enviarBtn = document.getElementById('enviarBtn');
  const nomeInput = document.getElementById('nomeInput');
  const categoriaSelect = document.getElementById('categoriaSelect');
  const emailInput = document.getElementById('emailInput');

  const verificarCamposObrigatorios = () => {
    const nomePreenchido = nomeInput.value.trim() !== '';
    const categoriaPreenchida = categoriaSelect.value !== '';
    const emailPreenchido = emailInput.value.trim() !== '';

    if (nomePreenchido && categoriaPreenchida && emailPreenchido) {
      enviarBtn.disabled = false;
    } else {
      enviarBtn.disabled = true;
    }
  };

  nomeInput.addEventListener('input', verificarCamposObrigatorios);
  categoriaSelect.addEventListener('change', verificarCamposObrigatorios);
  emailInput.addEventListener('input', verificarCamposObrigatorios);

  verificarCamposObrigatorios();
});
