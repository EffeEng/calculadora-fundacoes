import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFuros } from '@/lib/furos-provider';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

export function FuroSelector() {
  const { furos, furoAtivo, selecionarFuro, duplicarFuro, removerFuro } = useFuros();
  const colors = useColors();

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-foreground">
          Furos de Sondagem
        </Text>
        <Text className="text-xs text-muted">
          {furos.length} furo{furos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Horizontal scroll list of boreholes */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      >
        <View className="flex-row gap-2">
          {furos.map((furo) => (
            <Pressable
              key={furo.id}
              onPress={() => selecionarFuro(furo.id)}
              className={cn(
                'px-4 py-2 rounded-lg border flex-row items-center gap-2',
                furoAtivo === furo.id
                  ? 'bg-primary/20 border-primary'
                  : 'bg-background border-border'
              )}
            >
              <MaterialIcons
                name="location-on"
                size={16}
                color={furoAtivo === furo.id ? colors.primary : colors.muted}
              />
              <Text
                className={cn(
                  'font-semibold',
                  furoAtivo === furo.id ? 'text-primary' : 'text-foreground'
                )}
              >
                {furo.nome}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Active borehole details */}
      {furos.find((f) => f.id === furoAtivo) && (
        <View className="bg-background rounded-lg p-3 mb-4 border border-border">
          <Text className="text-xs font-semibold text-muted mb-2">
            Informações do Furo Ativo
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">Coordenadas:</Text>
              <Text className="text-xs text-foreground font-semibold">
                {furos.find((f) => f.id === furoAtivo)?.coordenadas}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">Profundidade Total:</Text>
              <Text className="text-xs text-foreground font-semibold">
                {furos.find((f) => f.id === furoAtivo)?.profundidadeTotal.toFixed(2)} m
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">Nível d'Água:</Text>
              <Text className="text-xs text-foreground font-semibold">
                {furos.find((f) => f.id === furoAtivo)?.nivelAgua.toFixed(2)} m
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-xs text-muted">Camadas:</Text>
              <Text className="text-xs text-foreground font-semibold">
                {furos.find((f) => f.id === furoAtivo)?.camadas.length}
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Action buttons */}
      <View className="flex-row gap-2">
        <Pressable
          onPress={() => furoAtivo && duplicarFuro(furoAtivo)}
          className="flex-1 bg-blue-500/10 border border-blue-500 rounded-lg py-2 flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="content-copy" size={16} color={colors.primary} />
          <Text className="text-blue-500 text-xs font-semibold">Duplicar</Text>
        </Pressable>

        <Pressable
          onPress={() => furoAtivo && removerFuro(furoAtivo)}
          disabled={furos.length <= 1}
          className={cn(
            'flex-1 rounded-lg py-2 flex-row items-center justify-center gap-2',
            furos.length <= 1
              ? 'bg-error/20 border border-error/50'
              : 'bg-error/10 border border-error'
          )}
        >
          <MaterialIcons
            name="delete"
            size={16}
            color={furos.length <= 1 ? colors.muted : colors.error}
          />
          <Text
            className={cn(
              'text-xs font-semibold',
              furos.length <= 1 ? 'text-muted' : 'text-error'
            )}
          >
            Remover
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
