import { Furo } from './dados-furos';
import { Camada } from './types';

/**
 * Gera um gráfico SVG de NSPT por profundidade
 */
export function gerarGraficoNSPT(furo: Furo): string {
  const camadas = furo.camadas;
  const width = 500;
  const height = 400;
  const padding = 60;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Calcular profundidades cumulativas
  let profundidadeAtual = 0;
  const pontos = camadas.map((camada) => {
    const profundidadeInicio = profundidadeAtual;
    profundidadeAtual += camada.espessura / 100; // Converter cm para m
    return {
      profundidadeInicio,
      profundidadeFim: profundidadeAtual,
      profundidadeMedia: (profundidadeInicio + profundidadeAtual) / 2,
      nspt: camada.nspt,
    };
  });

  const maxNSPT = Math.max(...camadas.map((c) => c.nspt), 50);
  const maxProfundidade = profundidadeAtual;

  // Escala
  const escalaX = chartWidth / maxNSPT;
  const escalaY = chartHeight / maxProfundidade;

  // Gerar barras
  const barras = pontos
    .map((ponto, idx) => {
      const x1 = padding;
      const x2 = padding + ponto.nspt * escalaX;
      const y1 = padding + ponto.profundidadeInicio * escalaY;
      const y2 = padding + ponto.profundidadeFim * escalaY;

      return `
        <rect x="${x1}" y="${y1}" width="${x2 - x1}" height="${y2 - y1}" 
              fill="#0066CC" opacity="0.7" stroke="#0066CC" stroke-width="1"/>
        <text x="${x2 + 5}" y="${y1 + (y2 - y1) / 2}" font-size="12" fill="#333" 
              dominant-baseline="middle">${ponto.nspt}</text>
      `;
    })
    .join('');

  // Eixos
  const eixos = `
    <line x1="${padding}" y1="${padding}" x2="${padding}" y2="${height - padding}" 
          stroke="#333" stroke-width="2"/>
    <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" 
          stroke="#333" stroke-width="2"/>
  `;

  // Labels dos eixos
  const labels = `
    <text x="${width / 2}" y="${height - 10}" font-size="14" font-weight="bold" 
          text-anchor="middle" fill="#333">NSPT</text>
    <text x="20" y="${height / 2}" font-size="14" font-weight="bold" 
          text-anchor="middle" fill="#333" transform="rotate(-90 20 ${height / 2})">
          Profundidade (m)</text>
  `;

  // Grid horizontal
  const grid = Array.from({ length: 6 }, (_, i) => {
    const y = padding + (i * chartHeight) / 5;
    const prof = ((i * maxProfundidade) / 5).toFixed(1);
    return `
      <line x1="${padding - 5}" y1="${y}" x2="${width - padding}" y2="${y}" 
            stroke="#ddd" stroke-width="1" stroke-dasharray="5,5"/>
      <text x="${padding - 10}" y="${y + 4}" font-size="11" text-anchor="end" fill="#666">
            ${prof}m</text>
    `;
  }).join('');

  // Grid vertical
  const gridVertical = Array.from({ length: 6 }, (_, i) => {
    const x = padding + (i * chartWidth) / 5;
    const nspt = Math.round((i * maxNSPT) / 5);
    return `
      <line x1="${x}" y1="${padding}" x2="${x}" y2="${height - padding}" 
            stroke="#ddd" stroke-width="1" stroke-dasharray="5,5"/>
      <text x="${x}" y="${height - padding + 20}" font-size="11" text-anchor="middle" fill="#666">
            ${nspt}</text>
    `;
  }).join('');

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" style="border: 1px solid #ddd; border-radius: 4px;">
      <defs>
        <style>
          .chart-title { font-size: 16px; font-weight: bold; fill: #0066CC; }
        </style>
      </defs>
      
      <!-- Grid -->
      ${grid}
      ${gridVertical}
      
      <!-- Barras -->
      ${barras}
      
      <!-- Eixos -->
      ${eixos}
      
      <!-- Labels -->
      ${labels}
      
      <!-- Título -->
      <text x="${width / 2}" y="25" class="chart-title" text-anchor="middle">
            Variação de NSPT por Profundidade - ${furo.nome}</text>
    </svg>
  `;
}

/**
 * Gera um diagrama SVG das camadas de solo
 */
export function gerarDiagramaCamadas(furo: Furo, diametro: number = 50): string {
  const camadas = furo.camadas;
  const width = 400;
  const padding = 40;
  const diagramaWidth = width - 2 * padding;
  const estacaWidth = (diametro / 100) * 50; // Escala visual

  // Calcular altura total
  let alturaTotal = 0;
  camadas.forEach((c) => {
    alturaTotal += c.espessura;
  });

  const escalaAltura = 300 / (alturaTotal / 100); // Converter para metros e escalar
  const height = padding * 2 + escalaAltura;

  // Cores por tipo de solo
  const coresSolo: Record<string, string> = {
    areia: '#D4A574',
    silte: '#A9A9A9',
    argila: '#8B7355',
  };

  // Gerar camadas
  let profundidadeAtual = padding;
  const camadasSVG = camadas
    .map((camada, idx) => {
      const alturaEscalada = (camada.espessura / 100) * escalaAltura;
      const cor = coresSolo[camada.tipo] || '#999';

      const rect = `
        <rect x="${padding}" y="${profundidadeAtual}" width="${diagramaWidth}" height="${alturaEscalada}"
              fill="${cor}" stroke="#333" stroke-width="1" opacity="0.8"/>
        <text x="${padding + 10}" y="${profundidadeAtual + alturaEscalada / 2}" 
              font-size="11" fill="#fff" font-weight="bold">
              ${camada.tipo.toUpperCase()} (NSPT: ${camada.nspt})</text>
      `;

      profundidadeAtual += alturaEscalada;
      return rect;
    })
    .join('');

  // Desenhar estaca
  const estacaX = padding + diagramaWidth + 20;
  const estacaSVG = `
    <rect x="${estacaX}" y="${padding}" width="${estacaWidth}" height="${escalaAltura}"
          fill="#C0C0C0" stroke="#333" stroke-width="2" opacity="0.6"/>
    <text x="${estacaX + estacaWidth / 2}" y="${padding + 20}" 
          font-size="12" fill="#333" text-anchor="middle" font-weight="bold">
          Estaca</text>
    <text x="${estacaX + estacaWidth / 2}" y="${padding + 40}" 
          font-size="10" fill="#666" text-anchor="middle">
          Ø ${diametro}cm</text>
  `;

  // Escala de profundidade
  const escalaProf = Array.from({ length: Math.ceil(alturaTotal / 100 / 5) + 1 }, (_, i) => {
    const y = padding + (i * 5 * escalaAltura) / (alturaTotal / 100);
    const prof = (i * 5).toFixed(1);
    return `
      <line x1="${padding - 10}" y1="${y}" x2="${padding - 5}" y2="${y}" stroke="#333" stroke-width="1"/>
      <text x="${padding - 15}" y="${y + 4}" font-size="10" text-anchor="end" fill="#666">${prof}m</text>
    `;
  }).join('');

  // Legenda
  const legenda = `
    <g transform="translate(${width - 150}, 10)">
      <rect x="0" y="0" width="140" height="80" fill="#f9f9f9" stroke="#ddd" stroke-width="1" rx="4"/>
      ${Object.entries(coresSolo)
        .map(([tipo, cor], idx) => {
          const y = 15 + idx * 20;
          return `
            <rect x="10" y="${y - 8}" width="12" height="12" fill="${cor}" stroke="#333" stroke-width="0.5"/>
            <text x="28" y="${y}" font-size="11" fill="#333">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</text>
          `;
        })
        .join('')}
    </g>
  `;

  return `
    <svg width="${width + 50}" height="${height}" xmlns="http://www.w3.org/2000/svg" 
         style="border: 1px solid #ddd; border-radius: 4px; background-color: #fafafa;">
      
      <!-- Escala de profundidade -->
      ${escalaProf}
      
      <!-- Camadas de solo -->
      ${camadasSVG}
      
      <!-- Estaca -->
      ${estacaSVG}
      
      <!-- Legenda -->
      ${legenda}
      
      <!-- Título -->
      <text x="${(width + 50) / 2}" y="25" font-size="14" font-weight="bold" 
            fill="#0066CC" text-anchor="middle">
            Perfil Estratigráfico - ${furo.nome}</text>
    </svg>
  `;
}
