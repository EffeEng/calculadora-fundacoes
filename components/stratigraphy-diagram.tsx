import React from 'react';
import { View, Text } from 'react-native';
import { Camada, TipoSolo } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

// Cores para cada tipo de solo
const CORES_SOLO: Record<TipoSolo, string> = {
  areia: '#D4A574', // Bege/Marrom claro
  silte: '#B8956A', // Marrom médio
  argila: '#8B7355', // Marrom escuro
};

const LABELS_SOLO: Record<TipoSolo, string> = {
  areia: 'Areia',
  silte: 'Silte',
  argila: 'Argila',
};

interface StratigraphyDiagramProps {
  camadas: Camada[];
  diametro: number; // em cm
}

export function StratigraphyDiagram({ camadas, diametro }: StratigraphyDiagramProps) {
  const colors = useColors();

  if (camadas.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4 border border-border items-center justify-center min-h-64">
        <Text className="text-muted text-sm">Nenhuma camada adicionada</Text>
      </View>
    );
  }

  // Calcular altura total
  const alturaTotal = camadas.reduce((sum, c) => sum + c.espessura, 0);

  // Altura máxima do diagrama em pixels
  const maxDiagramHeight = 300;

  // Escala: pixels por cm
  const escala = maxDiagramHeight / alturaTotal;

  // Largura da estaca no diagrama
  const larguraEstaca = Math.max(60, Math.min(120, diametro / 2));

  return (
    <View className="bg-surface rounded-2xl p-4 border border-border">
      {/* Header */}
      <Text className="text-lg font-semibold text-foreground mb-4">
        Perfil Estratigráfico
      </Text>

      {/* Diagrama */}
      <View className="flex-row gap-4 items-start">
        {/* Coluna da Estaca */}
        <View className="items-center gap-2">
          <Text className="text-xs font-semibold text-muted mb-2">Estaca</Text>
          <View
            style={{
              width: larguraEstaca,
              height: maxDiagramHeight,
              backgroundColor: '#C0C0C0',
              borderWidth: 2,
              borderColor: '#808080',
              borderRadius: 4,
            }}
          />
          <Text className="text-xs text-muted">
            Ø {diametro} cm
          </Text>
        </View>

        {/* Coluna das Camadas */}
        <View className="flex-1">
          <Text className="text-xs font-semibold text-muted mb-2">Camadas de Solo</Text>
          <View
            style={{
              height: maxDiagramHeight,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 4,
              overflow: 'hidden',
              backgroundColor: colors.background,
            }}
          >
            {camadas.map((camada, index) => {
              const altura = camada.espessura * escala;
              const corSolo = CORES_SOLO[camada.tipo];
              const labelSolo = LABELS_SOLO[camada.tipo];

              return (
                <View
                  key={camada.id}
                  style={{
                    height: altura,
                    backgroundColor: corSolo,
                    borderBottomWidth: 1,
                    borderBottomColor: '#666',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: '600',
                      color: '#FFFFFF',
                      textAlign: 'center',
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowOffset: { width: 0.5, height: 0.5 },
                      textShadowRadius: 1,
                    }}
                  >
                    {labelSolo}
                  </Text>
                  <Text
                    style={{
                      fontSize: 8,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      marginTop: 2,
                      textShadowColor: 'rgba(0, 0, 0, 0.5)',
                      textShadowOffset: { width: 0.5, height: 0.5 },
                      textShadowRadius: 1,
                    }}
                  >
                    NSPT: {camada.nspt}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Coluna de Profundidade */}
        <View className="items-end">
          <Text className="text-xs font-semibold text-muted mb-2">Prof. (cm)</Text>
          <View
            style={{
              height: maxDiagramHeight,
              justifyContent: 'space-between',
              paddingVertical: 4,
            }}
          >
            <Text className="text-xs text-muted font-medium">0</Text>
            {camadas.map((camada, index) => {
              const profundidadeAcumulada = camadas
                .slice(0, index + 1)
                .reduce((sum, c) => sum + c.espessura, 0);
              const posicao = (profundidadeAcumulada / alturaTotal) * maxDiagramHeight;

              return (
                <Text
                  key={camada.id}
                  style={{
                    fontSize: 10,
                    color: colors.muted,
                    fontWeight: '500',
                  }}
                >
                  {profundidadeAcumulada}
                </Text>
              );
            })}
          </View>
        </View>
      </View>

      {/* Legenda */}
      <View className="mt-4 pt-4 border-t border-border">
        <Text className="text-xs font-semibold text-muted mb-2">Legenda</Text>
        <View className="flex-row flex-wrap gap-3">
          {(Object.entries(CORES_SOLO) as [TipoSolo, string][]).map(([tipo, cor]) => (
            <View key={tipo} className="flex-row items-center gap-2">
              <View
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: cor,
                  borderRadius: 2,
                  borderWidth: 1,
                  borderColor: '#666',
                }}
              />
              <Text className="text-xs text-foreground capitalize">{tipo}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
