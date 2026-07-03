import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useCalculadora } from '@/lib/calculadora-provider';
import { calcularParametrosElasticos } from '@/lib/calculations';

export function ExportacaoCard() {
  const { state } = useCalculadora();
  const parametros = calcularParametrosElasticos(state.diametro, state.camadas);

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
      {/* Header */}
      <Text className="text-lg font-semibold text-foreground mb-4">
        Exportação para Software Estrutural
      </Text>

      {/* Tabela */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Cabeçalho */}
          <View className="flex-row gap-3 pb-2 border-b-2 border-border">
            <Text className="w-12 text-xs font-bold text-muted">Camada</Text>
            <Text className="w-16 text-xs font-bold text-muted">Alt. (cm)</Text>
            <Text className="w-16 text-xs font-bold text-muted">Kv (tf/m³)</Text>
            <Text className="w-16 text-xs font-bold text-muted">Kh (tf/m³)</Text>
            <Text className="w-16 text-xs font-bold text-muted">Poisson</Text>
          </View>

          {/* Linhas */}
          {parametros.map((param, index) => (
            <View
              key={index}
              className="flex-row gap-3 py-2 border-b border-border last:border-b-0"
            >
              <Text className="w-12 text-xs text-foreground font-medium">
                {param.camada}
              </Text>
              <Text className="w-16 text-xs text-foreground">
                {param.espessura}
              </Text>
              <Text className="w-16 text-xs text-foreground font-semibold text-primary">
                {param.Kv}
              </Text>
              <Text className="w-16 text-xs text-foreground font-semibold text-primary">
                {param.Kh}
              </Text>
              <Text className="w-16 text-xs text-foreground">
                {param.poisson.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Nota */}
      <Text className="text-xs text-muted mt-3 italic">
        Valores de Kv e Kh arredondados para inteiros. Poisson com 2 casas decimais.
      </Text>
    </View>
  );
}
