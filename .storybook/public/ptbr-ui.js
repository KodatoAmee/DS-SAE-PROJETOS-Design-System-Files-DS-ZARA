/*
 * Tradução pt-BR da interface do Storybook (manager e blocos de docs).
 * O Storybook não tem i18n oficial: este script troca textos e atributos
 * (title, aria-label, placeholder) por correspondência exata, e observa o DOM
 * para traduzir o que o React renderizar depois. Carregado por
 * manager-head.html e preview-head.html. Textos do DS não passam por aqui.
 */
(function () {
  var D = {
    // Barra lateral e navegação
    "Skip to content": "Pular para o conteúdo",
    "Skip to sidebar": "Pular para a barra lateral",
    "Search for components": "Buscar componentes",
    "Find components": "Buscar componentes",
    "Stories": "Histórias",
    "Docs": "Documentação",
    "Recently opened": "Abertos recentemente",
    "Clear history": "Limpar histórico",
    "No components found": "Nenhum componente encontrado",
    "Tag filters": "Filtros de tag",
    "Create a new story": "Criar nova história",
    "Open context menu": "Abrir menu de contexto",
    "Collapse": "Recolher",
    "Expand": "Expandir",
    "Expand all": "Expandir tudo",
    "Collapse all": "Recolher tudo",
    "Sidebar resize handle": "Redimensionar barra lateral",
    "Settings": "Configurações",
    "Keyboard shortcuts": "Atalhos de teclado",
    "About your Storybook": "Sobre o Storybook",
    "Show sidebar": "Mostrar barra lateral",
    "Hide sidebar": "Ocultar barra lateral",
    "Show toolbar": "Mostrar barra de ferramentas",
    "Hide toolbar": "Ocultar barra de ferramentas",
    "Show addons panel": "Mostrar painel de complementos",
    "Hide addons panel": "Ocultar painel de complementos",
    "Learn what's new in Storybook": "Veja as novidades do Storybook",
    "Dismiss notification": "Dispensar notificação",
    "Open onboarding guide": "Abrir guia de introdução",
    "Expand onboarding guide": "Expandir guia de introdução",
    "Level up": "Próximo nível",
    "Done": "Concluído",
    "Skip": "Pular",

    // Barra de ferramentas
    "Toolbar": "Barra de ferramentas",
    "Main preview area": "Área de visualização",
    "Reload story": "Recarregar história",
    "Grid visibility": "Exibir grade",
    "Preview background": "Fundo da visualização",
    "Measure tool": "Ferramenta de medida",
    "Outline tool": "Ferramenta de contorno",
    "Viewport size": "Tamanho da tela",
    "Vision filter": "Filtro de visão",
    "Open in isolation mode": "Abrir isolado",
    "Change zoom level": "Mudar zoom",
    "Zoom in": "Aproximar",
    "Zoom out": "Afastar",
    "Reset zoom": "Redefinir zoom",
    "Enter full screen": "Tela cheia",
    "Exit full screen": "Sair da tela cheia",
    "Open in editor": "Abrir no editor",
    "Copy canvas link": "Copiar link",
    "Copy story link": "Copiar link da história",

    // Painel de complementos
    "Addon panel": "Painel de complementos",
    "Available addons": "Complementos disponíveis",
    "Addon panel resize handle": "Redimensionar painel",
    "Move addon panel to right": "Mover painel para a direita",
    "Move addon panel to bottom": "Mover painel para baixo",
    "Hide addon panel": "Ocultar painel",
    "Show addon panel": "Mostrar painel",
    "Controls": "Controles",
    "Actions": "Ações",
    "Interactions": "Interações",
    "Accessibility": "Acessibilidade",
    "This story has no controls": "Esta história não tem controles",
    "Read docs": "Ler documentação",
    "Reset controls": "Redefinir controles",
    "Clear": "Limpar",
    "Pass": "Aprovado",
    "Fail": "Reprovado",
    "Scroll to end": "Rolar até o fim",
    "Interaction steps": "Etapas da interação",
    "Component test playback controls": "Controles de reprodução do teste",
    "Go to start": "Ir ao início",
    "Go back": "Voltar",
    "Go forward": "Avançar",
    "Go to end": "Ir ao fim",
    "Rerun": "Executar de novo",
    "Violations": "Violações",
    "Passes": "Aprovações",
    "Inconclusive": "Inconclusivos",
    "No accessibility violations found.": "Nenhuma violação de acessibilidade encontrada.",
    "Highlight elements with accessibility test results":
      "Destacar elementos com resultados de acessibilidade",
    "Collapse all results": "Recolher todos os resultados",
    "Rerun accessibility scan": "Refazer verificação de acessibilidade",

    // Blocos de docs
    "Name": "Nome",
    "Description": "Descrição",
    "Default": "Padrão",
    "Control": "Controle",
    "Show code": "Mostrar código",
    "Hide code": "Ocultar código",
    "Copy code": "Copiar código",
    "Copy": "Copiar",
    "Copied": "Copiado",
    "Required": "Obrigatório",
    "Set string": "Definir texto",
    "Set object": "Definir objeto",
    "Set number": "Definir número",
    "Set boolean": "Definir booleano",
    "Choose option...": "Escolha uma opção...",
    "Edit JSON": "Editar JSON",
    "No Preview": "Sem visualização",
    "Please check the Storybook config.": "Verifique a configuração do Storybook.",
    "Try reloading the page.": "Tente recarregar a página.",
  };

  var P = [
    [/^Story status: (.+)$/, function (_, s) { return "Status da história: " + (D[s] || s); }],
    [/^(\d+)% completed$/, function (_, n) { return n + "% concluído"; }],
  ];

  function tr(s) {
    if (!s) return null;
    var t = s.trim();
    if (!t) return null;
    if (Object.prototype.hasOwnProperty.call(D, t)) return s.replace(t, D[t]);
    for (var i = 0; i < P.length; i++) {
      if (P[i][0].test(t)) return s.replace(t, t.replace(P[i][0], P[i][1]));
    }
    return null;
  }

  var ATTRS = ["title", "aria-label", "placeholder"];
  // Não tocar no conteúdo das histórias: só a interface do Storybook.
  function skip(el) {
    return el && el.closest && el.closest('#storybook-root, [id^="story--"], [data-zr-no-i18n]');
  }

  function fixText(node) {
    if (skip(node.parentElement)) return;
    var r = tr(node.nodeValue);
    if (r !== null && r !== node.nodeValue) node.nodeValue = r;
  }
  function fixAttrs(el) {
    if (skip(el)) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var v = el.getAttribute(ATTRS[i]);
      var r = tr(v);
      if (r !== null && r !== v) el.setAttribute(ATTRS[i], r);
    }
  }
  function walk(root) {
    if (root.nodeType === 3) return fixText(root);
    if (root.nodeType !== 1) return;
    fixAttrs(root);
    var w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) fixText(n);
      else fixAttrs(n);
    }
  }

  function start() {
    walk(document.body);
    new MutationObserver(function (list) {
      for (var i = 0; i < list.length; i++) {
        var m = list[i];
        if (m.type === "characterData") fixText(m.target);
        else if (m.type === "attributes") fixAttrs(m.target);
        else for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
      }
    }).observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }

  document.documentElement.lang = "pt-BR";
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
