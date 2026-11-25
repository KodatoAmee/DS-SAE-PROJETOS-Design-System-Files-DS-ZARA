# Governança — DS-Zara

## Fonte da verdade

1. `tokens/tokens.json` decide valores. `theme.css` espelha; mudança de valor entra nos dois no mesmo PR.
2. O Storybook é a documentação oficial. Componente sem story não existe.
3. `CONTRATO.md` define o que todo componente cumpre.

## Papéis

| Papel | Responsabilidade |
|---|---|
| Mantenedor do DS | Aprova tokens e componentes novos, publica versões |
| Contribuidor | Propõe e implementa, seguindo o checklist |
| Times consumidores | Reportam lacunas e bugs; não copiam componente para dentro do app |

## Fluxo de mudança

1. **Proposta**: issue com problema, telas onde aparece e por que os componentes atuais não resolvem.
2. **Triagem**: o mantenedor classifica (token, variante, componente novo, padrão) e decide se entra no núcleo ou fica local.
3. **Implementação** em branch própria, uma mudança por PR.
4. **Revisão** com o checklist abaixo.
5. **Release** com entrada no `CHANGELOG.md`.

## Checklist de PR

- [ ] Só tokens: nenhum hex, `rgb()` ou cor arbitrária em componente.
- [ ] Raio 0, sem sombra, linhas de 1px.
- [ ] Contraste AA: texto 4,5:1, componentes e bordas 3:1, nos dois temas.
- [ ] Alvo mínimo 24x24; 44 em toque.
- [ ] Teclado completo; `Esc` fecha sobreposições; foco visível (`focusRing`).
- [ ] Roles e `aria-*` corretos; textos de acessibilidade em português.
- [ ] Controlado e não controlado quando há estado.
- [ ] Story com variantes, estados e descrição (O que é, Quando usar, Quando não usar, Anatomia, Acessibilidade).
- [ ] Painel de acessibilidade do Storybook sem violações.
- [ ] `npm run typecheck` e `npm run build` verdes.
- [ ] Entrada no `CHANGELOG.md`.

## Versionamento (SemVer)

- **Patch**: correção sem mudança de API ou visual intencional.
- **Minor**: componente, variante ou token novo; mudança visual compatível.
- **Major**: prop removida ou renomeada, token removido, mudança de comportamento. Deprecie numa minor antes, com aviso em dev.

## Ciclo de release

Minor a cada 2 semanas quando houver mudança; patch quando necessário. Toda release gera o Storybook estático.

## Métricas de adoção

- % de telas que importam só do DS (sem componente local equivalente).
- Ocorrências de cor/hex literal nos apps consumidores (meta: 0).
- Componentes locais que duplicam um do DS.
- Tempo entre proposta e release.
- Violações do addon de acessibilidade por release.

## Maturidade

| Nível | Critério | Estado |
|---|---|---|
| Inicial | Tokens + componentes básicos documentados | **Atual (0.1.0)** |
| Intermediário | Adotado em ≥ 1 produto, espelho no Figma, testes visuais | Próximo |
| Avançado | Vários produtos, métricas automáticas, contribuição externa regular | — |
