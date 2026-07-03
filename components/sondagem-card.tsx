import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  FlatList,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCalculadora } from '@/lib/calculadora-provider';
import { TipoSolo } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

const TIPOS_SOLO: { label: string; value: TipoSolo }[] = [
  { label: 'Areia', value: 'areia' },
  { label: 'Silte', value: 'silte' },
  { label: 'Argila', value: 'argila' },
];

export function SondagemCard() {
  const { state, adicionarCamada, removerCamada, atualizarCamada, carregarCamadas } = useCalculadora();
  const colors = useColors();
  const [dropdownAberto, setDropdownAberto] = useState<string | null>(null);

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-semibold text-foreground">
          Perfil de Sondagem
        </Text>
        <Text className="text-xs text-muted">
          {state.camadas.length} camada{state.camadas.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Lista de Camadas */}
      <FlatList
        data={state.camadas}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item: camada, index }) => (
          <View key={camada.id} className="mb-3 pb-3 border-b border-border last:border-b-0">
            {/* Número da Camada */}
            <Text className="text-xs font-semibold text-muted mb-2">
              Camada {index + 1}
            </Text>

            {/* Inputs em linha */}
            <View className="gap-2">
              {/* Altura da Camada */}
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Altura da Camada (cm)</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-2 py-2 text-foreground text-sm"
                  placeholder="100"
                  value={camada.espessura.toString()}
                  onChangeText={(text) => {
                    const valor = parseFloat(text);
                    if (!isNaN(valor) && valor > 0) {
                      atualizarCamada(camada.id, { espessura: valor });
                    }
                  }}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#687076"
                />
              </View>

              {/* NSPT */}
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">NSPT Médio</Text>
                <TextInput
                  className="bg-background border border-border rounded-lg px-2 py-2 text-foreground text-sm"
                  placeholder="10"
                  value={camada.nspt.toString()}
                  onChangeText={(text) => {
                    const valor = parseInt(text, 10);
                    if (!isNaN(valor) && valor > 0) {
                      atualizarCamada(camada.id, { nspt: valor });
                    }
                  }}
                  keyboardType="number-pad"
                  placeholderTextColor="#687076"
                />
              </View>

              {/* Tipo de Solo */}
              <View className="flex-1">
                <Text className="text-xs text-muted mb-1">Tipo de Solo</Text>
                <Pressable
                  onPress={() =>
                    setDropdownAberto(dropdownAberto === camada.id ? null : camada.id)
                  }
                  className="bg-background border border-border rounded-lg px-2 py-2 flex-row items-center justify-between"
                >
                  <Text className="text-foreground text-sm capitalize">
                    {TIPOS_SOLO.find((t) => t.value === camada.tipo)?.label}
                  </Text>
                  <MaterialIcons
                    name={dropdownAberto === camada.id ? 'expand-less' : 'expand-more'}
                    size={18}
                    color={colors.foreground}
                  />
                </Pressable>

                {/* Dropdown Menu */}
                {dropdownAberto === camada.id && (
                  <View className="absolute top-full left-0 right-0 bg-surface border border-border rounded-lg mt-1 z-10">
                    {TIPOS_SOLO.map((tipo) => (
                      <Pressable
                        key={tipo.value}
                        onPress={() => {
                          atualizarCamada(camada.id, { tipo: tipo.value });
                          setDropdownAberto(null);
                        }}
                        className="px-3 py-2 border-b border-border last:border-b-0"
                      >
                        <Text className="text-foreground text-sm capitalize">
                          {tipo.label}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Botão Remover */}
              <View className="justify-end pt-5">
                <Pressable
                  onPress={() => removerCamada(camada.id)}
                  disabled={state.camadas.length <= 1}
                  className={cn(
                    'p-2 rounded-lg',
                    state.camadas.length <= 1
                      ? 'bg-error/20'
                      : 'bg-error/10'
                  )}
                >
                  <MaterialIcons
                    name="delete"
                    size={20}
                    color={state.camadas.length <= 1 ? colors.muted : colors.error}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        )}
      />

      {/* Botão Adicionar Camada */}
      <Pressable
        onPress={adicionarCamada}
        className="bg-primary/10 border border-primary rounded-lg py-3 mt-4 flex-row items-center justify-center gap-2"
      >
        <MaterialIcons name="add" size={20} color={colors.primary} />
        <Text className="text-primary font-semibold">Adicionar Camada</Text>
      </Pressable>

      {/* Botão Importar Sondagem */}
      <Pressable
        onPress={() => {
          const dadosSP01 = [
            { id: "layer-0", espessura: 100, nspt: 0, tipo: "argila" as TipoSolo },
            { id: "layer-1", espessura: 45, nspt: 6, tipo: "argila" as TipoSolo },
            { id: "layer-2", espessura: 45, nspt: 2, tipo: "argila" as TipoSolo },
            { id: "layer-3", espessura: 45, nspt: 2, tipo: "argila" as TipoSolo },
            { id: "layer-4", espessura: 45, nspt: 8, tipo: "argila" as TipoSolo },
            { id: "layer-5", espessura: 45, nspt: 33, tipo: "areia" as TipoSolo },
            { id: "layer-6", espessura: 45, nspt: 22, tipo: "areia" as TipoSolo },
            { id: "layer-7", espessura: 45, nspt: 19, tipo: "areia" as TipoSolo },
            { id: "layer-8", espessura: 45, nspt: 22, tipo: "areia" as TipoSolo },
            { id: "layer-9", espessura: 45, nspt: 29, tipo: "areia" as TipoSolo },
            { id: "layer-10", espessura: 45, nspt: 30, tipo: "areia" as TipoSolo },
            { id: "layer-11", espessura: 45, nspt: 36, tipo: "areia" as TipoSolo },
            { id: "layer-12", espessura: 45, nspt: 33, tipo: "areia" as TipoSolo },
            { id: "layer-13", espessura: 45, nspt: 38, tipo: "areia" as TipoSolo },
            { id: "layer-14", espessura: 45, nspt: 42, tipo: "areia" as TipoSolo },
            { id: "layer-15", espessura: 45, nspt: 44, tipo: "areia" as TipoSolo },
            { id: "layer-16", espessura: 45, nspt: 53, tipo: "areia" as TipoSolo }
          ];
          carregarCamadas(dadosSP01);
        }}
        className="bg-blue-500/10 border border-blue-500 rounded-lg py-3 mt-2 flex-row items-center justify-center gap-2"
      >
        <MaterialIcons name="cloud-upload" size={20} color={colors.primary} />
        <Text className="text-blue-500 font-semibold">Importar Sondagem (SP-01)</Text>
      </Pressable>
    </View>
  );
}
