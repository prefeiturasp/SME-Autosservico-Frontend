# Changelog

## [0.2.0] - 2026-04-28

Release que entrega a aba Analytics do dashboard com os primeiros indicadores
de uso da plataforma.

### Novidades
- Nova aba Analytics no dashboard.
- Indicadores: média de sessão, usuários ativos por produto, distribuição de
  dispositivos, usuários por página e pico de uso de hoje.
- Ordenação por colunas no card de usuários por página.

### Melhorias
- MetricCard e TrendBadge extraídos como componentes compartilhados.
- MetricCard aceita badge customizado.
- TrendBadge mostra percentual e fica vermelho quando abaixo da média.
- Tabela semântica e helpers de ordenação no card de usuários por página.
- Reordenação e ajuste de larguras dos cards na aba Analytics.

### Correções
- Acentuação em textos exibidos ao usuário.
- Barra de progresso decorativa no card de dispositivos (sem `role="progressbar"`).
- Divider faltando no último item do card de dispositivos.
- Code smells apontados pelo SonarQube.

### Infra e testes
- Cobertura LCOV integrada ao SonarQube via Vitest.
- Novos cenários Cypress e ajustes na automação.
