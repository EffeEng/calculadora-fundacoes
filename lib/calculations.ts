/**
 * Lógica de cálculo para Parâmetros Elásticos e Capacidade de Carga
 */

import {
  Camada,
  CalculadoraState,
  FATORES_FUNDACAO,
  FATORES_SOLO,
  MODULO_DEFORMACAO_MULTIPLICADOR,
  POISSON,
  ResultadosCamada,
  ResultadosCapacidadeCarga,
  ResultadosCompletos,
  TipoSolo,
} from './types';

const PI = Math.PI;

/**
 * Calcula os parâmetros elásticos (Kv, Kh, Poisson) para cada camada
 */
export function calcularParametrosElasticos(
  diametro: number, // cm
  camadas: Camada[]
): ResultadosCamada[] {
  const diametroMetros = diametro / 100; // Converter para metros

  return camadas.map((camada, index) => {
    const tipo = camada.tipo as TipoSolo;
    const multiplicador = MODULO_DEFORMACAO_MULTIPLICADOR[tipo];
    const poisson = POISSON[tipo];

    // Es em tf/m²
    const Es = multiplicador * camada.nspt;

    // Kv em tf/m³
    const Kv = Es / diametroMetros;

    // Kh em tf/m³
    const Kh = 0.8 * Kv;

    return {
      camada: index + 1,
      espessura: camada.espessura,
      Kv: Math.round(Kv),
      Kh: Math.round(Kh),
      poisson: Math.round(poisson * 100) / 100, // 2 casas decimais
    };
  });
}

/**
 * Calcula a capacidade de carga pelo método Aoki-Velloso
 */
export function calcularCapacidadeCarga(
  state: CalculadoraState
): ResultadosCapacidadeCarga {
  const { diametro, tipoFundacao, camadas } = state;

  if (camadas.length === 0) {
    return {
      Rp: 0,
      Rl: 0,
      Padm: 0,
    };
  }

  const diametroMetros = diametro / 100;
  const fatores = FATORES_FUNDACAO[tipoFundacao];

  // Geometria
  const Ap = (PI * Math.pow(diametroMetros, 2)) / 4; // Área da ponta
  const U = PI * diametroMetros; // Perímetro

  // Resistência de Ponta (baseada na última camada)
  const ultimaCamada = camadas[camadas.length - 1];
  const tipoUltima = ultimaCamada.tipo as TipoSolo;
  const fatoresUltima = FATORES_SOLO[tipoUltima];

  const Rp = (Ap * (fatoresUltima.K * ultimaCamada.nspt)) / fatores.F1;

  // Resistência Lateral (somatório de todas as camadas)
  let Rl = 0;
  for (const camada of camadas) {
    const tipo = camada.tipo as TipoSolo;
    const fatoresSolo = FATORES_SOLO[tipo];
    const Li = camada.espessura / 100; // Converter para metros

    const RlI = (U * Li * (fatoresSolo.Alfa * fatoresSolo.K * camada.nspt)) / fatores.F2;
    Rl += RlI;
  }

  // Carga Admissível (FS = 2)
  const Padm = (Rp + Rl) / 2;

  return {
    Rp: Math.round(Rp * 10) / 10, // 1 casa decimal
    Rl: Math.round(Rl * 10) / 10, // 1 casa decimal
    Padm: Math.round(Padm * 10) / 10, // 1 casa decimal
  };
}

/**
 * Calcula todos os resultados
 */
export function calcularTodos(state: CalculadoraState): ResultadosCompletos {
  const parametrosElasticos = calcularParametrosElasticos(state.diametro, state.camadas);
  const capacidadeCarga = calcularCapacidadeCarga(state);

  return {
    parametrosElasticos,
    capacidadeCarga,
  };
}
