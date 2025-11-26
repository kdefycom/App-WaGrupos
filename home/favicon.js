
(function() {
  // SVG para um ícone 'K' estilizado com cor verde e fundo transparente.
  const svgIcon = '<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M16 8 L 16 56 M 52 8 L 16 32 L 52 56" stroke="%232ECC71" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // Criando o data URI para o favicon.
  const faviconUri = 'data:image/svg+xml,' + svgIcon;

  // Criando o elemento <link> para o favicon.
  const link = document.createElement('link');
  link.rel = 'icon';
  link.href = faviconUri;
  link.type = 'image/svg+xml';

  // Adicionando o favicon ao <head> do documento.
  document.head.appendChild(link);
})();
