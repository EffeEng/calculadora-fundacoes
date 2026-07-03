import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { CalculadoraState, Camada, TipoFundacao } from './types';

interface CalculadoraContextType {
  state: CalculadoraState;
  setDiametro: (diametro: number) => void;
  setTipoFundacao: (tipo: TipoFundacao) => void;
  adicionarCamada: () => void;
  removerCamada: (id: string) => void;
  atualizarCamada: (id: string, updates: Partial<Camada>) => void;
  carregarCamadas: (camadas: Camada[]) => void;
}

const CalculadoraContext = createContext<CalculadoraContextType | undefined>(undefined);

type Action =
  | { type: 'SET_DIAMETRO'; payload: number }
  | { type: 'SET_TIPO_FUNDACAO'; payload: TipoFundacao }
  | { type: 'ADICIONAR_CAMADA' }
  | { type: 'REMOVER_CAMADA'; payload: string }
  | { type: 'ATUALIZAR_CAMADA'; payload: { id: string; updates: Partial<Camada> } }
  | { type: 'CARREGAR_CAMADAS'; payload: Camada[] };

const initialState: CalculadoraState = {
  diametro: 50,
  tipoFundacao: 'escavada',
  camadas: [
    {
      id: '1',
      espessura: 100,
      nspt: 10,
      tipo: 'areia',
    },
  ],
};

function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function calculadoraReducer(state: CalculadoraState, action: Action): CalculadoraState {
  switch (action.type) {
    case 'SET_DIAMETRO':
      return { ...state, diametro: action.payload };

    case 'SET_TIPO_FUNDACAO':
      return { ...state, tipoFundacao: action.payload };

    case 'ADICIONAR_CAMADA': {
      const novaCamada: Camada = {
        id: gerarId(),
        espessura: 100,
        nspt: 10,
        tipo: 'areia',
      };
      return { ...state, camadas: [...state.camadas, novaCamada] };
    }

    case 'REMOVER_CAMADA': {
      if (state.camadas.length <= 1) return state; // Manter mínimo 1 camada
      return {
        ...state,
        camadas: state.camadas.filter((c) => c.id !== action.payload),
      };
    }

    case 'ATUALIZAR_CAMADA': {
      return {
        ...state,
        camadas: state.camadas.map((c) =>
          c.id === action.payload.id ? { ...c, ...action.payload.updates } : c
        ),
      };
    }

    case 'CARREGAR_CAMADAS': {
      return { ...state, camadas: action.payload };
    }

    default:
      return state;
  }
}

export function CalculadoraProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(calculadoraReducer, initialState);

  const value: CalculadoraContextType = {
    state,
    setDiametro: (diametro) => dispatch({ type: 'SET_DIAMETRO', payload: diametro }),
    setTipoFundacao: (tipo) => dispatch({ type: 'SET_TIPO_FUNDACAO', payload: tipo }),
    adicionarCamada: () => dispatch({ type: 'ADICIONAR_CAMADA' }),
    removerCamada: (id) => dispatch({ type: 'REMOVER_CAMADA', payload: id }),
    atualizarCamada: (id, updates) =>
      dispatch({ type: 'ATUALIZAR_CAMADA', payload: { id, updates } }),
    carregarCamadas: (camadas) => dispatch({ type: 'CARREGAR_CAMADAS', payload: camadas }),
  };

  return (
    <CalculadoraContext.Provider value={value}>
      {children}
    </CalculadoraContext.Provider>
  );
}

export function useCalculadora(): CalculadoraContextType {
  const context = useContext(CalculadoraContext);
  if (!context) {
    throw new Error('useCalculadora deve ser usado dentro de CalculadoraProvider');
  }
  return context;
}
