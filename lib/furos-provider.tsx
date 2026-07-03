import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Furo, FUROS_SONDAGEM } from './dados-furos';

interface FurosContextType {
  furos: Furo[];
  furoAtivo: string | null;
  furoAtualizado: Furo | null;
  selecionarFuro: (id: string) => void;
  atualizarFuro: (id: string, furo: Furo) => void;
  adicionarFuro: (furo: Furo) => void;
  removerFuro: (id: string) => void;
  duplicarFuro: (id: string) => void;
}

const FurosContext = createContext<FurosContextType | undefined>(undefined);

type Action =
  | { type: 'SELECIONAR_FURO'; payload: string }
  | { type: 'ATUALIZAR_FURO'; payload: { id: string; furo: Furo } }
  | { type: 'ADICIONAR_FURO'; payload: Furo }
  | { type: 'REMOVER_FURO'; payload: string }
  | { type: 'DUPLICAR_FURO'; payload: string };

interface FurosState {
  furos: Furo[];
  furoAtivo: string | null;
}

const initialState: FurosState = {
  furos: FUROS_SONDAGEM,
  furoAtivo: 'sp-01',
};

function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function furosReducer(state: FurosState, action: Action): FurosState {
  switch (action.type) {
    case 'SELECIONAR_FURO':
      return { ...state, furoAtivo: action.payload };

    case 'ATUALIZAR_FURO': {
      return {
        ...state,
        furos: state.furos.map((f) =>
          f.id === action.payload.id ? action.payload.furo : f
        ),
      };
    }

    case 'ADICIONAR_FURO': {
      return {
        ...state,
        furos: [...state.furos, action.payload],
        furoAtivo: action.payload.id,
      };
    }

    case 'REMOVER_FURO': {
      const novosFuros = state.furos.filter((f) => f.id !== action.payload);
      return {
        ...state,
        furos: novosFuros,
        furoAtivo: state.furoAtivo === action.payload ? novosFuros[0]?.id || null : state.furoAtivo,
      };
    }

    case 'DUPLICAR_FURO': {
      const furoOriginal = state.furos.find((f) => f.id === action.payload);
      if (!furoOriginal) return state;

      const novoId = gerarId();
      const novoFuro: Furo = {
        ...furoOriginal,
        id: novoId,
        nome: `${furoOriginal.nome} (cópia)`,
      };

      return {
        ...state,
        furos: [...state.furos, novoFuro],
        furoAtivo: novoId,
      };
    }

    default:
      return state;
  }
}

export function FurosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(furosReducer, initialState);

  const furoAtualizado = state.furos.find((f) => f.id === state.furoAtivo) || null;

  const value: FurosContextType = {
    furos: state.furos,
    furoAtivo: state.furoAtivo,
    furoAtualizado,
    selecionarFuro: (id) => dispatch({ type: 'SELECIONAR_FURO', payload: id }),
    atualizarFuro: (id, furo) => dispatch({ type: 'ATUALIZAR_FURO', payload: { id, furo } }),
    adicionarFuro: (furo) => dispatch({ type: 'ADICIONAR_FURO', payload: furo }),
    removerFuro: (id) => dispatch({ type: 'REMOVER_FURO', payload: id }),
    duplicarFuro: (id) => dispatch({ type: 'DUPLICAR_FURO', payload: id }),
  };

  return (
    <FurosContext.Provider value={value}>
      {children}
    </FurosContext.Provider>
  );
}

export function useFuros(): FurosContextType {
  const context = useContext(FurosContext);
  if (!context) {
    throw new Error('useFuros deve ser usado dentro de FurosProvider');
  }
  return context;
}
