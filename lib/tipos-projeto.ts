import { Furo } from './dados-furos';

export interface Projeto {
  id: string;
  nome: string;
  local: string;
  proprietario: string;
  quantidadeFuros: number;
  data: string; // ISO date string
  descricao?: string;
  furos: Furo[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface ProjetoListItem {
  id: string;
  nome: string;
  local: string;
  proprietario: string;
  quantidadeFuros: number;
  data: string;
  criadoEm: string;
}
