import { Camada, TipoSolo } from './types';

export interface Furo {
  id: string;
  nome: string;
  coordenadas: string;
  profundidadeTotal: number;
  nivelAgua: number;
  camadas: Camada[];
}

// Dados extraídos manualmente do laudo de sondagem
export const FUROS_SONDAGEM: Furo[] = [
  {
    id: 'sp-01',
    nome: 'SP-01',
    coordenadas: "19º52'45.6''S, 44º59'02.6''W",
    profundidadeTotal: 16.45,
    nivelAgua: 1.0,
    camadas: [
      { id: 'sp01-layer-0', espessura: 100, nspt: 0, tipo: 'argila' as TipoSolo },
      { id: 'sp01-layer-1', espessura: 45, nspt: 6, tipo: 'argila' as TipoSolo },
      { id: 'sp01-layer-2', espessura: 45, nspt: 2, tipo: 'argila' as TipoSolo },
      { id: 'sp01-layer-3', espessura: 45, nspt: 2, tipo: 'argila' as TipoSolo },
      { id: 'sp01-layer-4', espessura: 45, nspt: 8, tipo: 'argila' as TipoSolo },
      { id: 'sp01-layer-5', espessura: 45, nspt: 33, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-6', espessura: 45, nspt: 22, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-7', espessura: 45, nspt: 19, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-8', espessura: 45, nspt: 22, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-9', espessura: 45, nspt: 29, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-10', espessura: 45, nspt: 30, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-11', espessura: 45, nspt: 36, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-12', espessura: 45, nspt: 33, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-13', espessura: 45, nspt: 38, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-14', espessura: 45, nspt: 42, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-15', espessura: 45, nspt: 44, tipo: 'areia' as TipoSolo },
      { id: 'sp01-layer-16', espessura: 45, nspt: 53, tipo: 'areia' as TipoSolo },
    ],
  },
  {
    id: 'sp-02',
    nome: 'SP-02',
    coordenadas: "19º52'45.7''S, 44º59'02.5''W",
    profundidadeTotal: 12.45,
    nivelAgua: 1.0,
    camadas: [
      { id: 'sp02-layer-0', espessura: 100, nspt: 0, tipo: 'argila' as TipoSolo },
      { id: 'sp02-layer-1', espessura: 45, nspt: 8, tipo: 'argila' as TipoSolo },
      { id: 'sp02-layer-2', espessura: 45, nspt: 3, tipo: 'argila' as TipoSolo },
      { id: 'sp02-layer-3', espessura: 45, nspt: 2, tipo: 'argila' as TipoSolo },
      { id: 'sp02-layer-4', espessura: 45, nspt: 12, tipo: 'silte' as TipoSolo },
      { id: 'sp02-layer-5', espessura: 45, nspt: 16, tipo: 'silte' as TipoSolo },
      { id: 'sp02-layer-6', espessura: 45, nspt: 16, tipo: 'silte' as TipoSolo },
      { id: 'sp02-layer-7', espessura: 45, nspt: 26, tipo: 'areia' as TipoSolo },
      { id: 'sp02-layer-8', espessura: 45, nspt: 24, tipo: 'areia' as TipoSolo },
      { id: 'sp02-layer-9', espessura: 45, nspt: 30, tipo: 'areia' as TipoSolo },
      { id: 'sp02-layer-10', espessura: 45, nspt: 35, tipo: 'areia' as TipoSolo },
      { id: 'sp02-layer-11', espessura: 45, nspt: 38, tipo: 'areia' as TipoSolo },
      { id: 'sp02-layer-12', espessura: 45, nspt: 54, tipo: 'areia' as TipoSolo },
    ],
  },
  {
    id: 'sp-03',
    nome: 'SP-03',
    coordenadas: "19º52'45.8''S, 44º59'02.1''W",
    profundidadeTotal: 14.0,
    nivelAgua: 1.0,
    camadas: [
      { id: 'sp03-layer-0', espessura: 100, nspt: 4, tipo: 'argila' as TipoSolo },
      { id: 'sp03-layer-1', espessura: 45, nspt: 7, tipo: 'argila' as TipoSolo },
      { id: 'sp03-layer-2', espessura: 45, nspt: 3, tipo: 'argila' as TipoSolo },
      { id: 'sp03-layer-3', espessura: 45, nspt: 5, tipo: 'silte' as TipoSolo },
      { id: 'sp03-layer-4', espessura: 45, nspt: 14, tipo: 'silte' as TipoSolo },
      { id: 'sp03-layer-5', espessura: 45, nspt: 18, tipo: 'silte' as TipoSolo },
      { id: 'sp03-layer-6', espessura: 45, nspt: 28, tipo: 'areia' as TipoSolo },
      { id: 'sp03-layer-7', espessura: 45, nspt: 25, tipo: 'areia' as TipoSolo },
      { id: 'sp03-layer-8', espessura: 45, nspt: 32, tipo: 'areia' as TipoSolo },
      { id: 'sp03-layer-9', espessura: 45, nspt: 37, tipo: 'areia' as TipoSolo },
      { id: 'sp03-layer-10', espessura: 45, nspt: 40, tipo: 'areia' as TipoSolo },
    ],
  },
];
