
(function() {
    'use strict';

    // --- Lógica de Cache Busting ---
    // Adiciona um número de versão (baseado na hora atual) aos arquivos CSS e JS locais.
    // Isso força o navegador a baixar a versão mais recente dos arquivos, 
    // em vez de usar uma versão antiga que está no cache.
    function aplicarCacheBusting() {
        const versao = new Date().getTime();
        const dominioLocal = window.location.hostname;

        // Atualiza os arquivos de estilo (CSS)
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
        stylesheets.forEach(sheet => {
            const url = new URL(sheet.href);
            if (url.hostname === dominioLocal) {
                url.searchParams.set('v', versao);
                sheet.href = url.href;
            }
        });

        // Atualiza os scripts (JS)
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            const url = new URL(script.src);
            if (url.hostname === dominioLocal) {
                url.searchParams.set('v', versao);
                script.src = url.src;
            }
        });
         console.log(`Recursos atualizados para a versão ${versao} para garantir o conteúdo mais recente.`);
    }

    // --- Lógica do Indicador Visual de Atualização ---
    // Altera a cor da barra superior do navegador quando o usuário atualiza a página (F5 ou Ctrl+R).
    // Isso fornece um feedback visual de que uma nova versão do site está sendo carregada.
    function configurarIndicadorDeAtualizacao() {
        let metaTema = document.querySelector('meta[name="theme-color"]');
        if (!metaTema) {
            metaTema = document.createElement('meta');
            metaTema.name = 'theme-color';
            metaTema.content = '#FFFFFF'; // Cor padrão
            document.head.appendChild(metaTema);
        }

        const definirCorDeAtualizacao = () => {
            metaTema.content = '#8A2BE2'; // Um tom de roxo
        };

        // Escuta os atalhos de teclado para atualização
        window.addEventListener('keydown', (e) => {
            if (e.key === 'F5' || (e.ctrlKey && e.key.toLowerCase() === 'r')) {
                definirCorDeAtualizacao();
            }
        });

        // Dispara a mudança de cor um pouco antes da página ser descarregada (o que acontece ao atualizar)
        window.addEventListener('beforeunload', definirCorDeAtualizacao);
    }

    // --- Execução ---
    // Executa as funções assim que a estrutura da página (DOM) estiver pronta.
    document.addEventListener('DOMContentLoaded', () => {
        aplicarCacheBusting();
        configurarIndicadorDeAtualizacao();
    });

})();
