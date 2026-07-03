# Calculadora de Fundações - TODO

## Branding & Setup
- [x] Gerar logo customizado para o app
- [x] Atualizar app.config.ts com nome e logo
- [x] Configurar paleta de cores em theme.config.js

## Core Features
- [x] Implementar Card de Configuração Global (Diâmetro + Tipo de Fundação)
- [x] Implementar Segmented Control para seleção de tipo de fundação
- [x] Implementar tooltips/textos de apoio para tipos de fundação
- [x] Implementar Card de Perfil de Sondagem (adicionar/remover camadas)
- [x] Implementar inputs de camada (Espessura, NSPT, Tipo de Solo)
- [x] Implementar lógica de cálculo de Parâmetros Elásticos (Kv, Kh, Poisson)
- [x] Implementar lógica de cálculo de Capacidade de Carga (Aoki-Velloso)
- [x] Implementar Card de Exportação (Tabela de parâmetros)
- [x] Implementar Card de Resumo Geotécnico (Padm, Rl, Rp)
- [x] Implementar rodapé com referência normativa

## Validation & UX
- [x] Validar inputs numéricos
- [x] Validar mínimo de 1 camada
- [x] Implementar feedback visual de erros
- [x] Implementar recálculo em tempo real
- [x] Testar responsividade em diferentes tamanhos de tela

## Testing
- [x] Testar cálculos com dados conhecidos
- [x] Testar fluxo completo de entrada e saída
- [x] Testar remoção de camadas
- [x] Testar dark mode

## Deployment
- [ ] Criar checkpoint final
- [ ] Preparar para publicação

## Melhorias Solicitadas
- [x] Criar diagrama visual de camadas empilhadas proporcionalmente
- [x] Implementar importação de dados de sondagem (SP-01) na calculadora


## Gerenciamento de Múltiplos Furos
- [x] Criar estrutura de dados para múltiplos furos (SP-01, SP-02, SP-03)
- [x] Implementar seletor de furo ativo
- [x] Adicionar dados de SP-02 e SP-03
- [x] Criar interface de comparação entre furos
- [x] Implementar visualização lado a lado de estratigrafias
- [x] Adicionar análise de variações de NSPT entre furos
- [x] Implementar funcionalidade de duplicar/copiar furo


## Gerenciador de Projetos
- [x] Criar tipos de dados para Projeto (local, proprietário, quantidade de furos, data, etc.)
- [x] Implementar Provider para gerenciar projetos com persistência em AsyncStorage
- [x] Criar Tab "Projetos" com lista de projetos salvos
- [x] Implementar formulário de criação/edição de projeto
- [x] Adicionar funcionalidades de deletar e duplicar projetos
- [x] Separar Tab "Calculadora" para trabalhar com projeto selecionado
- [x] Integrar dados de furos com projeto específ ico
- [x] Implementar busca e filtro de projetos


## Exportação de Relatórios em PDF
- [x] Criar utilitário para geração de PDF com design profissional
- [x] Implementar relatório de análise de resistência de estaca
- [x] Implementar relatório de furo de sondagem
- [x] Adicionar gráficos e visualizações nos relatórios
- [x] Criar componente de botão para exportar relatórios
- [x] Testar exportação em diferentes dispositivos

## Melhorias em Relatórios
- [x] Adicionar gráfico de NSPT por profundidade nos relatórios
- [x] Incluir diagrama visual das camadas de solo nos relatórios
- [x] Gerar SVG para gráficos que funcionem em HTML
- [x] Testar visualização dos relatórios com gráficos


## Correções de Bugs Solicitadas
- [x] Corrigir fluxo de navegação para entrar em projeto selecionado
- [x] Integrar calculadora dentro da tela de detalhes do projeto
- [x] Resolver problema do teclado sobrepondo campos de formulário
- [x] Implementar exportação em PDF real (não HTML)
- [x] Testar fluxo completo em dispositivo móvel


## Análise de Profundidade por Camada
- [x] Implementar cálculo de Padm para cada camada de profundidade
- [x] Criar tabela de carga admissível vs profundidade
- [x] Gerar gráfico de carga admissível vs profundidade
- [x] Adicionar campo para carga do projeto estrutural
- [x] Implementar recomendação de profundidade ideal
- [x] Criar card de análise de profundidade


## Comparação de Múltiplos Diâmetros
- [x] Adicionar seletor de múltiplos diâmetros para comparação
- [x] Calcular Padm por profundidade para cada diâmetro
- [x] Criar tabela comparativa com múltiplos diâmetros
- [x] Destacar opção mais econômica (menor diâmetro que atende a carga)


## Cálculo de Volume de Concreto
- [x] Calcular volume de concreto para cada combinação diâmetro × profundidade
- [x] Exibir volume na tabela comparativa
- [x] Adicionar campo de custo por m³ de concreto
- [x] Calcular custo estimado por estaca
