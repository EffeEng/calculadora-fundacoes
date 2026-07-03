import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Projeto } from './tipos-projeto';
import { FUROS_SONDAGEM } from './dados-furos';

interface ProjetosContextType {
  projetos: Projeto[];
  projetoAtivo: string | null;
  projetoAtualizado: Projeto | null;
  carregandoProjetos: boolean;
  criarProjeto: (projeto: Omit<Projeto, 'id' | 'criadoEm' | 'atualizadoEm'>) => void;
  selecionarProjeto: (id: string) => void;
  atualizarProjeto: (id: string, projeto: Partial<Projeto>) => void;
  deletarProjeto: (id: string) => void;
  duplicarProjeto: (id: string) => void;
}

const ProjetosContext = createContext<ProjetosContextType | undefined>(undefined);

type Action =
  | { type: 'CARREGAR_PROJETOS'; payload: Projeto[] }
  | { type: 'CRIAR_PROJETO'; payload: Projeto }
  | { type: 'SELECIONAR_PROJETO'; payload: string }
  | { type: 'ATUALIZAR_PROJETO'; payload: { id: string; projeto: Partial<Projeto> } }
  | { type: 'DELETAR_PROJETO'; payload: string }
  | { type: 'DUPLICAR_PROJETO'; payload: Projeto };

interface ProjetosState {
  projetos: Projeto[];
  projetoAtivo: string | null;
  carregandoProjetos: boolean;
}

const initialState: ProjetosState = {
  projetos: [],
  projetoAtivo: null,
  carregandoProjetos: true,
};

function gerarId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function projetosReducer(state: ProjetosState, action: Action): ProjetosState {
  switch (action.type) {
    case 'CARREGAR_PROJETOS':
      return {
        ...state,
        projetos: action.payload,
        carregandoProjetos: false,
        projetoAtivo: action.payload[0]?.id || null,
      };

    case 'CRIAR_PROJETO': {
      const novosProjetos = [...state.projetos, action.payload];
      return {
        ...state,
        projetos: novosProjetos,
        projetoAtivo: action.payload.id,
      };
    }

    case 'SELECIONAR_PROJETO':
      return { ...state, projetoAtivo: action.payload };

    case 'ATUALIZAR_PROJETO': {
      return {
        ...state,
        projetos: state.projetos.map((p) =>
          p.id === action.payload.id
            ? {
                ...p,
                ...action.payload.projeto,
                atualizadoEm: new Date().toISOString(),
              }
            : p
        ),
      };
    }

    case 'DELETAR_PROJETO': {
      const novosProjetos = state.projetos.filter((p) => p.id !== action.payload);
      return {
        ...state,
        projetos: novosProjetos,
        projetoAtivo: state.projetoAtivo === action.payload ? novosProjetos[0]?.id || null : state.projetoAtivo,
      };
    }

    case 'DUPLICAR_PROJETO': {
      const novoProjeto: Projeto = {
        ...action.payload,
        id: gerarId(),
        nome: `${action.payload.nome} (cópia)`,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      return {
        ...state,
        projetos: [...state.projetos, novoProjeto],
        projetoAtivo: novoProjeto.id,
      };
    }

    default:
      return state;
  }
}

const STORAGE_KEY = '@calculadora_projetos';

export function ProjetosProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projetosReducer, initialState);

  // Carregar projetos do AsyncStorage ao iniciar
  useEffect(() => {
    const carregarProjetos = async () => {
      try {
        const projetosArmazenados = await AsyncStorage.getItem(STORAGE_KEY);
        if (projetosArmazenados) {
          const projetos = JSON.parse(projetosArmazenados) as Projeto[];
          dispatch({ type: 'CARREGAR_PROJETOS', payload: projetos });
        } else {
          // Se não houver projetos, criar um projeto de exemplo
          const projetoExemplo: Projeto = {
            id: gerarId(),
            nome: 'Projeto SP-01',
            local: 'Belo Horizonte, MG',
            proprietario: 'Exemplo Incorporadora',
            quantidadeFuros: 3,
            data: new Date().toISOString().split('T')[0],
            descricao: 'Projeto de exemplo com dados de sondagem',
            furos: FUROS_SONDAGEM,
            criadoEm: new Date().toISOString(),
            atualizadoEm: new Date().toISOString(),
          };
          dispatch({ type: 'CARREGAR_PROJETOS', payload: [projetoExemplo] });
        }
      } catch (erro) {
        console.error('Erro ao carregar projetos:', erro);
        dispatch({ type: 'CARREGAR_PROJETOS', payload: [] });
      }
    };

    carregarProjetos();
  }, []);

  // Salvar projetos no AsyncStorage sempre que mudarem
  useEffect(() => {
    const salvarProjetos = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state.projetos));
      } catch (erro) {
        console.error('Erro ao salvar projetos:', erro);
      }
    };

    if (!state.carregandoProjetos) {
      salvarProjetos();
    }
  }, [state.projetos, state.carregandoProjetos]);

  const projetoAtualizado = state.projetos.find((p) => p.id === state.projetoAtivo) || null;

  const value: ProjetosContextType = {
    projetos: state.projetos,
    projetoAtivo: state.projetoAtivo,
    projetoAtualizado,
    carregandoProjetos: state.carregandoProjetos,
    criarProjeto: (projeto) => {
      const novoProjeto: Projeto = {
        ...projeto,
        id: gerarId(),
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
      };
      dispatch({ type: 'CRIAR_PROJETO', payload: novoProjeto });
    },
    selecionarProjeto: (id) => dispatch({ type: 'SELECIONAR_PROJETO', payload: id }),
    atualizarProjeto: (id, projeto) =>
      dispatch({ type: 'ATUALIZAR_PROJETO', payload: { id, projeto } }),
    deletarProjeto: (id) => dispatch({ type: 'DELETAR_PROJETO', payload: id }),
    duplicarProjeto: (id) => {
      const projeto = state.projetos.find((p) => p.id === id);
      if (projeto) {
        dispatch({ type: 'DUPLICAR_PROJETO', payload: projeto });
      }
    },
  };

  return (
    <ProjetosContext.Provider value={value}>
      {children}
    </ProjetosContext.Provider>
  );
}

export function useProjetos(): ProjetosContextType {
  const context = useContext(ProjetosContext);
  if (!context) {
    throw new Error('useProjetos deve ser usado dentro de ProjetosProvider');
  }
  return context;
}
