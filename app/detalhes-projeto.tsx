import React, { useEffect } from 'react';
import { ScrollView, View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { useProjetos } from '@/lib/projetos-provider';
import { useFuros } from '@/lib/furos-provider';
import { useCalculadora } from '@/lib/calculadora-provider';
import { ConfigCard } from '@/components/config-card';
import { SondagemCard } from '@/components/sondagem-card';
import { ExportacaoCard } from '@/components/exportacao-card';
import { ResumoCard } from '@/components/resumo-card';
import { StratigraphyDiagram } from '@/components/stratigraphy-diagram';
import { FuroSelector } from '@/components/furo-selector';
import { ExportadorRelatorios } from '@/components/exportador-relatorios';
import { AnaliseProfundidadeCard } from '@/components/analise-profundidade-card';
import { calcularCapacidadeCarga } from '@/lib/calculations';

export default function DetalhesProjeto() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { projetos } = useProjetos();
  const { state } = useCalculadora();
  const { furoAtualizado } = useFuros();
  const resultados = calcularCapacidadeCarga(state);

  const projeto = projetos.find((p) => p.id === id);

  useEffect(() => {
    if (!projeto) {
      router.back();
    }
  }, [projeto, router]);

  if (!projeto) {
    return null;
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com botão voltar */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-1">
            <Text className="text-3xl font-bold text-foreground">{projeto.nome}</Text>
            <Text className="text-sm text-muted mt-1">{projeto.local}</Text>
          </View>
          <Pressable
            onPress={() => router.back()}
            className="bg-surface rounded-full p-3 active:opacity-70"
          >
            <Text className="text-foreground text-xl">✕</Text>
          </Pressable>
        </View>

        {/* Informações do Projeto */}
        <View className="bg-surface rounded-lg p-4 mb-4 border border-border">
          <Text className="text-sm font-semibold text-foreground mb-3">Informações do Projeto</Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Proprietário:</Text>
              <Text className="text-sm font-medium text-foreground">{projeto.proprietario}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Quantidade de Furos:</Text>
              <Text className="text-sm font-medium text-foreground">{projeto.quantidadeFuros}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-muted">Data:</Text>
              <Text className="text-sm font-medium text-foreground">{projeto.data}</Text>
            </View>
          </View>
        </View>

        {/* Seletor de Furos */}
        <FuroSelector />

        {/* Cards da Calculadora */}
        <ConfigCard />
        <SondagemCard />

        {/* Diagrama Estratigráfico */}
        {furoAtualizado && (
          <StratigraphyDiagram camadas={state.camadas} diametro={state.diametro} />
        )}

        <ExportacaoCard />
        <ResumoCard />
        <AnaliseProfundidadeCard />

        {/* Exportador de Relatórios */}
        {furoAtualizado && (
          <ExportadorRelatorios
            furo={furoAtualizado}
            projeto={projeto}
            diametro={state.diametro}
            padm={resultados.Padm}
            rp={resultados.Rp}
            rl={resultados.Rl}
            kv={0}
            kh={0}
          />
        )}

        {/* Rodapé */}
        <View className="mt-6 pt-4 border-t border-border pb-8">
          <Text className="text-xs text-muted text-center leading-relaxed">
            Calculadora de Fundações • Método Aoki-Velloso (1975)
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
