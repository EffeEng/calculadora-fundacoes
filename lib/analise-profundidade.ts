import { Camada } from './types';

export interface CargaPorCamada {
  camadaIndex: number;
  profundidadeAte: number;
  profundidadeMedia: number;
  nsptMedio: number;
  padm: number;
  rp: number;
  rl: number;
  tipoSolo: string;
}

export interface AnaliseProfundidade {
  cargasPorCamada: CargaPorCamada[];
  profundidadeIdeal: number;
  padmIdeal: number;
  recomendacao: string;
}

/**
 * Calcula a carga admissível acumulada até cada camada
 * Baseado no método Aoki-Velloso (1975)
 */
export function calcularCargaPorCamada(
  camadas: Camada[],
  diametro: number
): CargaPorCamada[] {
  const cargasPorCamada: CargaPorCamada[] = [];
  let profundidadeAcumulada = 0;

  // Fatores de solo para Aoki-Velloso
  const fatoresSolo: Record<string, { Ka: number; Ks: number }> = {
    areia: { Ka: 0.8, Ks: 3.5 },
    silte: { Ka: 0.9, Ks: 2.0 },
    argila: { Ka: 0.9, Ks: 2.0 },
  };

    camadas.forEach((camada, index) => {
    // Pular camada com NSPT = 0 (camada de cobertura)
    if (camada.nspt === 0) {
      profundidadeAcumulada += camada.espessura / 100;
      return;
    }

    const profundidadeAte = profundidadeAcumulada + camada.espessura / 100; // Converter cm para m
    const profundidadeMedia = profundidadeAcumulada + (camada.espessura / 100) / 2;

    // Calcular NSPT médio até esta camada
    const nsptMedio = camadas
      .slice(0, index + 1)
      .reduce((sum, c) => sum + c.nspt, 0) / (index + 1);

    // Fator de solo
    const soloLower = camada.tipo.toLowerCase();
    const fator = fatoresSolo[soloLower] || fatoresSolo.silte;

    // Cálculo de Resistência de Ponta (Rp) - Aoki-Velloso
    // Rp = Ka * N * Ab
    // Ab = π * (D/2)² (área da base)
    const diametroM = diametro / 100; // Converter cm para m
    const areaBase = Math.PI * Math.pow(diametroM / 2, 2);
    const rp = fator.Ka * nsptMedio * areaBase * 10; // Multiplicar por 10 para converter para kN

    // Cálculo de Atrito Lateral (Rl) - Aoki-Velloso
    // Rl = Ks * N * Al
    // Al = π * D * L (área lateral)
    const perimetro = Math.PI * diametroM;
    const areaLateral = perimetro * profundidadeAte;
    const rl = fator.Ks * nsptMedio * areaLateral * 10; // Multiplicar por 10 para converter para kN

    // Carga Admissível com FS = 2
    const padm = (rp + rl) / 2;

    cargasPorCamada.push({
      camadaIndex: index,
      profundidadeAte,
      profundidadeMedia,
      nsptMedio,
      padm,
      rp,
      rl,
      tipoSolo: camada.tipo,
    });

    profundidadeAcumulada = profundidadeAte;
  });

  return cargasPorCamada;
}

/**
 * Analisa qual profundidade é ideal baseado na carga do projeto
 */
export function analisarProfundidadeIdeal(
  cargasPorCamada: CargaPorCamada[],
  cargaProjeto?: number
): AnaliseProfundidade {
  let profundidadeIdeal = 0;
  let padmIdeal = 0;
  let recomendacao = '';

  if (cargasPorCamada.length === 0) {
    return {
      cargasPorCamada: [],
      profundidadeIdeal: 0,
      padmIdeal: 0,
      recomendacao: 'Nenhuma camada adicionada',
    };
  }

  // Se carga do projeto foi informada, encontrar profundidade mínima que atende
  if (cargaProjeto && cargaProjeto > 0) {
    const camadasAdequadas = cargasPorCamada.filter((c) => c.padm >= cargaProjeto);

    if (camadasAdequadas.length > 0) {
      // Usar a primeira camada que atende (menor profundidade)
      const camadasOrdenadas = camadasAdequadas.sort(
        (a, b) => a.profundidadeAte - b.profundidadeAte
      );
      const camadaselecionada = camadasOrdenadas[0];
      profundidadeIdeal = camadaselecionada.profundidadeAte;
      padmIdeal = camadaselecionada.padm;
      recomendacao = `✓ Profundidade ideal: ${profundidadeIdeal.toFixed(2)}m (Padm = ${padmIdeal.toFixed(2)} kN)`;
    } else {
      // Nenhuma camada atende a carga
      const ultimaCamada = cargasPorCamada[cargasPorCamada.length - 1];
      profundidadeIdeal = ultimaCamada.profundidadeAte;
      padmIdeal = ultimaCamada.padm;
      recomendacao = `✗ Carga ${cargaProjeto.toFixed(2)} kN não é atendida. Máximo disponível: ${padmIdeal.toFixed(2)} kN a ${profundidadeIdeal.toFixed(2)}m`;
    }
  } else {
    // Se não informou carga, recomendar a profundidade com maior capacidade
    const camadasOrdenadas = cargasPorCamada.sort((a, b) => b.padm - a.padm);
    const camadaselecionada = camadasOrdenadas[0];
    profundidadeIdeal = camadaselecionada.profundidadeAte;
    padmIdeal = camadaselecionada.padm;
    recomendacao = `Maior capacidade: ${padmIdeal.toFixed(2)} kN a ${profundidadeIdeal.toFixed(2)}m`;
  }

  return {
    cargasPorCamada,
    profundidadeIdeal,
    padmIdeal,
    recomendacao,
  };
}

/**
 * Formata dados para exibição em tabela
 */
export function formatarTabelaCargaPorCamada(
  cargasPorCamada: CargaPorCamada[]
): Array<{
  camada: number;
  profundidade: string;
  nspt: string;
  rp: string;
  rl: string;
  padm: string;
}> {
  return cargasPorCamada.map((c) => ({
    camada: c.camadaIndex + 1,
    profundidade: `${c.profundidadeAte.toFixed(2)}m`,
    nspt: c.nsptMedio.toFixed(1),
    rp: `${c.rp.toFixed(2)}`,
    rl: `${c.rl.toFixed(2)}`,
    padm: `${c.padm.toFixed(2)}`,
  }));
}
