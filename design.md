# Design da Calculadora de Fundações

## Visão Geral

Aplicativo móvel profissional para cálculo de parâmetros elásticos e capacidade de carga de fundações profundas. Design limpo, mobile-first com foco em produtividade e precisão técnica.

## Paleta de Cores

- **Primária**: #0066CC (Azul profissional)
- **Secundária**: #22C55E (Verde para resultados positivos)
- **Fundo**: #FFFFFF (Light) / #151718 (Dark)
- **Superfícies**: #F5F5F5 (Light) / #1E2022 (Dark)
- **Texto Principal**: #11181C (Light) / #ECEDEE (Dark)
- **Texto Secundário**: #687076 (Light) / #9BA1A6 (Dark)
- **Bordas**: #E5E7EB (Light) / #334155 (Dark)
- **Sucesso**: #22C55E
- **Aviso**: #F59E0B
- **Erro**: #EF4444

## Telas Principais

### 1. Home Screen (Principal)
**Conteúdo:**
- Header com título "Calculadora de Fundações"
- ScrollView com cards empilhados verticalmente
- Card 1: Configuração Global da Estaca
  - Input: Diâmetro (cm)
  - Segmented Control: Tipo de Fundação (3 opções)
  - Tooltip/Texto de apoio para cada tipo
- Card 2: Perfil de Sondagem
  - Lista dinâmica de camadas
  - Botão "Adicionar Camada"
  - Cada camada em bloco horizontal com:
    - Input: Espessura (cm)
    - Input: NSPT Médio
    - Dropdown: Tipo de Solo
    - Ícone de lixeira para remover
- Card 3: Exportação (Tabela de Parâmetros Elásticos)
  - Tabela: Camada | Espessura | Kv | Kh | Poisson
- Card 4: Resumo Geotécnico
  - Destaque visual com tipografia grande
  - Carga Admissível (Padm) em destaque
  - Atrito Lateral (Rl) e Resistência de Ponta (Rp)
- Rodapé: Texto de referência normativa

**Funcionalidade:**
- Recálculo em tempo real ao alterar qualquer input
- Validação de inputs (mínimo 1 camada)
- Feedback visual de estados

## Fluxo Principal

1. Usuário abre o app
2. Insere diâmetro da estaca
3. Seleciona tipo de fundação (com tooltip)
4. Adiciona camadas de solo sequencialmente
5. App recalcula automaticamente
6. Visualiza resultados em cards de exportação e resumo
7. Pode remover camadas ou modificar dados

## Componentes Reutilizáveis

- **Card**: Container com sombra e borda
- **InputField**: Input numérico com label
- **SegmentedControl**: Seletor de tipo de fundação
- **LayerItem**: Bloco de camada com inputs e botão remover
- **ResultCard**: Card de resultado com tipografia destacada
- **Table**: Tabela de parâmetros elásticos

## Considerações de UX

- Orientação: Portrait (9:16)
- Uso com uma mão: Controles no terço inferior
- Feedback imediato: Cálculos instantâneos
- Validação clara: Mensagens de erro/aviso
- Acessibilidade: Labels descritivos, contraste adequado
- Responsividade: Funciona em telas pequenas e médias
