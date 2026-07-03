import { ScrollView, View, Text } from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { CalculadoraProvider } from '@/lib/calculadora-provider';
import { ConfigCard } from '@/components/config-card';
import { SondagemCard } from '@/components/sondagem-card';
import { ExportacaoCard } from '@/components/exportacao-card';
import { ResumoCard } from '@/components/resumo-card';
import { StratigraphyDiagram } from '@/components/stratigraphy-diagram';
import { useCalculadora } from '@/lib/calculadora-provider';
import { FuroSelector } from '@/components/furo-selector';
import { ComparativoFuros } from '@/components/comparativo-furos';
import { useFuros } from '@/lib/furos-provider';
import { ExportadorRelatorios } from '@/components/exportador-relatorios';
import { calcularCapacidadeCarga } from '@/lib/calculations';

function CalculadoraContent() {
  const { state } = useCalculadora();
  const { furoAtualizado } = useFuros();
  const resultados = calcularCapacidadeCarga(state);

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground">
            Calculadora de Fundações
          </Text>
          <Text className="text-sm text-muted mt-1">
            Método Aoki-Velloso
          </Text>
        </View>

        {/* Seletor de Furos */}
        <FuroSelector />

        {/* Comparativo de Furos */}
        <ComparativoFuros />

        {/* Cards */}
        <ConfigCard />
        <SondagemCard />
        
        {/* Diagrama Estratigráfico */}
        {furoAtualizado && (
          <StratigraphyDiagram camadas={state.camadas} diametro={state.diametro} />
        )}
        
        <ExportacaoCard />
        <ResumoCard />
        
        {/* Exportador de Relatórios */}
        {furoAtualizado && (
          <ExportadorRelatorios
            furo={furoAtualizado}
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
            Cálculos baseados em Aoki-Velloso (1975) com FS=2. Parâmetros elásticos
            (molas) estimados por correlações empíricas.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

export default function HomeScreen() {
  // Remover o CalculadoraProvider pois agora está no _layout.tsx
  return (
    <CalculadoraContent />
  );
}
