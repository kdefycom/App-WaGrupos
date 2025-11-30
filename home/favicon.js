
(function() {
  // SVG para um ícone 'K' estilizado com cor verde e fundo transparente.
  const svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="32" font-weight="bold" fill="%2328a745">K</text></svg>';

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
