import React from 'react';
import { View, Text } from 'react-native';
import { useCalculadora } from '@/lib/calculadora-provider';
import { calcularCapacidadeCarga } from '@/lib/calculations';
import { useColors } from '@/hooks/use-colors';

export function ResumoCard() {
  const { state } = useCalculadora();
  const colors = useColors();
  const resultados = calcularCapacidadeCarga(state);

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
      {/* Header */}
      <Text className="text-lg font-semibold text-foreground mb-6">
        Resumo Geotécnico
      </Text>

      {/* Carga Admissível - Destaque Principal */}
      <View className="bg-primary/10 border-2 border-primary rounded-xl p-6 mb-6 items-center">
        <Text className="text-xs font-semibold text-primary uppercase mb-2">
          Carga Admissível
        </Text>
        <Text className="text-5xl font-bold text-primary">
          {resultados.Padm.toFixed(1)}
        </Text>
        <Text className="text-sm font-semibold text-primary mt-2">tf</Text>
      </View>

      {/* Componentes de Resistência */}
      <View className="flex-row gap-4">
        {/* Atrito Lateral */}
        <View className="flex-1 bg-background border border-border rounded-lg p-4 items-center">
          <Text className="text-xs text-muted font-medium mb-2">Atrito Lateral</Text>
          <Text className="text-2xl font-bold text-foreground">
            {resultados.Rl.toFixed(1)}
          </Text>
          <Text className="text-xs text-muted mt-1">tf</Text>
        </View>

        {/* Resistência de Ponta */}
        <View className="flex-1 bg-background border border-border rounded-lg p-4 items-center">
          <Text className="text-xs text-muted font-medium mb-2">
            Resistência de Ponta
          </Text>
          <Text className="text-2xl font-bold text-foreground">
            {resultados.Rp.toFixed(1)}
          </Text>
          <Text className="text-xs text-muted mt-1">tf</Text>
        </View>
      </View>

      {/* Fórmula */}
      <View className="mt-6 pt-4 border-t border-border">
        <Text className="text-xs text-muted text-center">
          Padm = (Rp + Rl) / 2
        </Text>
      </View>
    </View>
  );
}
