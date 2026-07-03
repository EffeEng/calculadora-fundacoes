/**
 * Tipos e interfaces para a Calculadora de Fundações
 */

export type TipoFundacao = 'escavada' | 'helice' | 'premoldada';
export type TipoSolo = 'areia' | 'silte' | 'argila';

export interface FatoresFundacao {
  F1: number;
  F2: number;
  descricao: string;
  tooltip: string;
}

export interface FatoresSolo {
  K: number;
  Alfa: number;
}

export interface Camada {
  id: string;
  espessura: number; // em cm
  nspt: number;
  tipo: TipoSolo;
}

export interface CalculadoraState {
  diametro: number; // em cm
  tipoFundacao: TipoFundacao;
  camadas: Camada[];
}

export interface ParametrosElasticos {
  Kv: number; // tf/m³
  Kh: number; // tf/m³
  poisson: number;
}

export interface ResultadosCamada {
  camada: number;
  espessura: number; // cm
  Kv: number; // tf/m³
  Kh: number; // tf/m³
  poisson: number;
}

export interface ResultadosCapacidadeCarga {
  Rp: number; // tf
  Rl: number; // tf
  Padm: number; // tf
}

export interface ResultadosCompletos {
  parametrosElasticos: ResultadosCamada[];
  capacidadeCarga: ResultadosCapacidadeCarga;
}

// Constantes de cálculo
export const FATORES_FUNDACAO: Record<TipoFundacao, FatoresFundacao> = {
  escavada: {
    F1: 3.0,
    F2: 6.0,
    descricao: 'Estaca Escavada',
    tooltip: 'Trado mecânico convencional',
  },
  helice: {
    F1: 1.0,
    F2: 2.0,
    descricao: 'Hélice Contínua',
    tooltip: 'Concretagem sob pressão, melhor atrito',
  },
  premoldada: {
    F1: 1.0,
    F2: 2.0,
    descricao: 'Estaca Pré-moldada',
    tooltip: 'Concreto cravado',
  },
};

export const FATORES_SOLO: Record<TipoSolo, FatoresSolo> = {
  areia: {
    K: 100,
    Alfa: 0.014,
  },
  silte: {
    K: 40,
    Alfa: 0.024,
  },
  argila: {
    K: 20,
    Alfa: 0.060,
  },
};

export const MODULO_DEFORMACAO_MULTIPLICADOR: Record<TipoSolo, number> = {
  areia: 300,
  silte: 200,
  argila: 150,
};

export const POISSON: Record<TipoSolo, number> = {
  areia: 0.30,
  silte: 0.35,
  argila: 0.40,
};
