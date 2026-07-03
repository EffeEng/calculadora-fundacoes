import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFuros } from '@/lib/furos-provider';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export function ComparativoFuros() {
  const { furos } = useFuros();
  const colors = useColors();
  const [furosSelecionados, setFurosSelecionados] = useState<string[]>(
    furos.slice(0, 2).map((f) => f.id)
  );

  const furosParaComparar = furos.filter((f) => furosSelecionados.includes(f.id));

  const toggleFuro = (id: string) => {
    setFurosSelecionados((prev) => {
      if (prev.includes(id)) {
        return prev.filter((f) => f !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Calcular profundidade máxima para normalização
  const profundidadeMaxima = Math.max(...furos.map((f) => f.profundidadeTotal));

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
      {/* Header */}
      <Text className="text-lg font-semibold text-foreground mb-4">
        Comparativo de Furos
      </Text>

      {/* Selector de furos para comparação */}
      <View className="mb-4">
        <Text className="text-xs font-semibold text-muted mb-2">
          Selecione furos para comparar:
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {furos.map((furo) => (
            <Pressable
              key={furo.id}
              onPress={() => toggleFuro(furo.id)}
              className={cn(
                'px-3 py-2 rounded-lg border',
                furosSelecionados.includes(furo.id)
                  ? 'bg-primary/20 border-primary'
                  : 'bg-background border-border'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-semibold',
                  furosSelecionados.includes(furo.id)
                    ? 'text-primary'
                    : 'text-muted'
                )}
              >
                {furo.nome}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Comparação lado a lado */}
      {furosParaComparar.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4">
            {furosParaComparar.map((furo) => (
              <View
                key={furo.id}
                className="bg-background rounded-lg p-3 border border-border"
                style={{ width: 200 }}
              >
                {/* Cabeçalho do furo */}
                <View className="mb-3 pb-3 border-b border-border">
                  <Text className="text-sm font-bold text-foreground">
                    {furo.nome}
                  </Text>
                  <Text className="text-xs text-muted mt-1">
                    {furo.coordenadas}
                  </Text>
                </View>

                {/* Informações do furo */}
                <View className="gap-2 mb-3">
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-muted">Prof. Total:</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {furo.profundidadeTotal.toFixed(2)} m
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-muted">Nível Água:</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {furo.nivelAgua.toFixed(2)} m
                    </Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-muted">Camadas:</Text>
                    <Text className="text-xs font-semibold text-foreground">
                      {furo.camadas.length}
                    </Text>
                  </View>
                </View>

                {/* Resumo de NSPT */}
                <View className="bg-surface rounded-lg p-2 mb-3">
                  <Text className="text-xs font-semibold text-muted mb-2">
                    NSPT por Camada
                  </Text>
                  <View className="gap-1">
                    {furo.camadas.slice(0, 5).map((camada, idx) => (
                      <View
                        key={camada.id}
                        className="flex-row justify-between items-center"
                      >
                        <Text className="text-xs text-muted">
                          C{idx + 1}:
                        </Text>
                        <View
                          className="h-4 rounded bg-primary/30"
                          style={{
                            width: Math.max(20, (camada.nspt / 60) * 100),
                          }}
                        >
                          <Text className="text-xs font-bold text-primary text-center">
                            {camada.nspt}
                          </Text>
                        </View>
                      </View>
                    ))}
                    {furo.camadas.length > 5 && (
                      <Text className="text-xs text-muted mt-1">
                        +{furo.camadas.length - 5} camadas
                      </Text>
                    )}
                  </View>
                </View>

                {/* Distribuição de solos */}
                <View className="bg-surface rounded-lg p-2">
                  <Text className="text-xs font-semibold text-muted mb-2">
                    Tipos de Solo
                  </Text>
                  <View className="gap-1">
                    {['areia', 'silte', 'argila'].map((tipo) => {
                      const count = furo.camadas.filter(
                        (c) => c.tipo === tipo
                      ).length;
                      return count > 0 ? (
                        <View
                          key={tipo}
                          className="flex-row justify-between text-xs"
                        >
                          <Text className="text-muted capitalize">
                            {tipo}:
                          </Text>
                          <Text className="font-semibold text-foreground">
                            {count}
                          </Text>
                        </View>
                      ) : null;
                    })}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="bg-background rounded-lg p-4 items-center justify-center">
          <MaterialIcons name="info" size={24} color={colors.muted} />
          <Text className="text-sm text-muted mt-2">
            Selecione furos para comparar
          </Text>
        </View>
      )}
    </View>
  );
}
