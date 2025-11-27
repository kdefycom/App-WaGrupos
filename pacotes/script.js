/* JavaScript da Página de Pacotes VIP */
function comprar(pacote) {
  const urlParams = new URLSearchParams(window.location.search);
  const grupoId = urlParams.get('grupoId');
  
  let mensagem = `Você selecionou o pacote ${pacote}.`;
  if (grupoId) {
    mensagem += `\nPara o grupo com ID: ${grupoId}.`;
  } else {
    mensagem += `\nComo nenhum grupo foi especificado, essa ação não terá efeito.`;
  }
  
  mensagem += "\n\nIsso é apenas uma simulação. Nenhuma cobrança será feita."
  
  alert(mensagem);
}