import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';
import { useCalculadora } from '@/lib/calculadora-provider';
import { FATORES_FUNDACAO, TipoFundacao } from '@/lib/types';
import { cn } from '@/lib/utils';

export function ConfigCard() {
  const { state, setDiametro, setTipoFundacao } = useCalculadora();
  const [diametroInput, setDiametroInput] = useState(state.diametro.toString());
  const [tooltipVisivel, setTooltipVisivel] = useState<TipoFundacao | null>(null);

  const handleDiametroChange = (text: string) => {
    setDiametroInput(text);
    const valor = parseFloat(text);
    if (!isNaN(valor) && valor > 0) {
      setDiametro(valor);
    }
  };

  return (
    <View className="bg-surface rounded-2xl p-4 mb-4 border border-border">
      {/* Header */}
      <Text className="text-lg font-semibold text-foreground mb-4">
        Configuração Global da Estaca
      </Text>

      {/* Diâmetro Input */}
      <View className="mb-6">
        <Text className="text-sm font-medium text-muted mb-2">
          Diâmetro da Estaca (cm)
        </Text>
        <TextInput
          className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
          placeholder="Ex: 50"
          value={diametroInput}
          onChangeText={handleDiametroChange}
          keyboardType="decimal-pad"
          placeholderTextColor="#687076"
        />
      </View>

      {/* Tipo de Fundação */}
      <View>
        <Text className="text-sm font-medium text-muted mb-3">
          Tipo de Fundação (Método Executivo)
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          <View className="flex-row gap-2">
            {(Object.entries(FATORES_FUNDACAO) as [TipoFundacao, any][]).map(
              ([tipo, fatores]) => (
                <Pressable
                  key={tipo}
                  onPress={() => {
                    setTipoFundacao(tipo);
                    setTooltipVisivel(tipo);
                  }}
                  className={cn(
                    'px-4 py-3 rounded-lg border-2 min-w-max',
                    state.tipoFundacao === tipo
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'font-semibold text-sm',
                      state.tipoFundacao === tipo
                        ? 'text-background'
                        : 'text-foreground'
                    )}
                  >
                    {fatores.descricao}
                  </Text>
                </Pressable>
              )
            )}
          </View>
        </ScrollView>

        {/* Tooltip */}
        {tooltipVisivel && FATORES_FUNDACAO[tooltipVisivel] && (
          <View className="bg-primary/10 border border-primary rounded-lg p-3">
            <Text className="text-xs text-primary font-medium">
              {FATORES_FUNDACAO[tooltipVisivel].tooltip}
            </Text>
            <Text className="text-xs text-muted mt-1">
              F1 = {FATORES_FUNDACAO[tooltipVisivel].F1}, F2 ={' '}
              {FATORES_FUNDACAO[tooltipVisivel].F2}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
