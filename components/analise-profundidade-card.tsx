import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView, Pressable } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCalculadora } from '@/lib/calculadora-provider';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import {
  calcularCargaPorCamada,
  analisarProfundidadeIdeal,
  CargaPorCamada,
} from '@/lib/analise-profundidade';

const DIAMETROS_DISPONIVEIS = [20, 25, 30, 35, 40, 50, 60, 70, 80, 100, 120];

const CORES_DIAMETROS = [
  '#0066CC', '#E63946', '#2A9D8F', '#E9C46A', '#F4A261',
  '#264653', '#8338EC', '#FF006E', '#3A86FF', '#06D6A0', '#FB5607',
];

/**
 * Calcula o volume de concreto de uma estaca cilíndrica
 * V = π × (D/2)² × L
 * @param diametroCm - diâmetro em centímetros
 * @param profundidadeM - profundidade em metros
 * @returns volume em m³
 */
function calcularVolumeConcreto(diametroCm: number, profundidadeM: number): number {
  const raioM = (diametroCm / 100) / 2;
  return Math.PI * raioM * raioM * profundidadeM;
}

export function AnaliseProfundidadeCard() {
  const { state } = useCalculadora();
  const colors = useColors();
  const [cargaProjeto, setCargaProjeto] = useState('');
  const [custoM3, setCustoM3] = useState('');
  const [diametrosSelecionados, setDiametrosSelecionados] = useState<number[]>([
    state.diametro,
  ]);
  const [novoDiametro, setNovoDiametro] = useState('');
  const [mostrarVolume, setMostrarVolume] = useState(false);

  // Calcular cargas para cada diâmetro selecionado
  const resultadosPorDiametro = useMemo(() => {
    return diametrosSelecionados.map((d) => ({
      diametro: d,
      cargas: calcularCargaPorCamada(state.camadas, d),
    }));
  }, [state.camadas, diametrosSelecionados]);

  // Análise para o diâmetro principal
  const analisePrincipal = useMemo(() => {
    const cargaNum = cargaProjeto ? parseFloat(cargaProjeto) : undefined;
    if (resultadosPorDiametro.length > 0) {
      return analisarProfundidadeIdeal(resultadosPorDiametro[0].cargas, cargaNum);
    }
    return { cargasPorCamada: [], profundidadeIdeal: 0, padmIdeal: 0, recomendacao: '' };
  }, [resultadosPorDiametro, cargaProjeto]);

  // Encontrar opção mais econômica (menor diâmetro que atende a carga)
  const opcaoEconomica = useMemo(() => {
    const cargaNum = cargaProjeto ? parseFloat(cargaProjeto) : undefined;
    if (!cargaNum || cargaNum <= 0) return null;

    let melhorOpcao: { diametro: number; profundidade: number; padm: number; volume: number; custo: number } | null = null;
    const custoNumerico = custoM3 ? parseFloat(custoM3) : 0;

    for (const resultado of resultadosPorDiametro) {
      const camadasAdequadas = resultado.cargas.filter((c) => c.padm >= cargaNum);
      if (camadasAdequadas.length > 0) {
        const menorProfundidade = camadasAdequadas.sort(
          (a, b) => a.profundidadeAte - b.profundidadeAte
        )[0];
        const volume = calcularVolumeConcreto(resultado.diametro, menorProfundidade.profundidadeAte);
        const custo = volume * custoNumerico;

        if (
          !melhorOpcao ||
          volume < melhorOpcao.volume
        ) {
          melhorOpcao = {
            diametro: resultado.diametro,
            profundidade: menorProfundidade.profundidadeAte,
            padm: menorProfundidade.padm,
            volume,
            custo,
          };
        }
      }
    }

    return melhorOpcao;
  }, [resultadosPorDiametro, cargaProjeto, custoM3]);

  const adicionarDiametro = (d: number) => {
    if (!diametrosSelecionados.includes(d)) {
      setDiametrosSelecionados([...diametrosSelecionados, d].sort((a, b) => a - b));
    }
  };

  const removerDiametro = (d: number) => {
    if (diametrosSelecionados.length > 1) {
      setDiametrosSelecionados(diametrosSelecionados.filter((x) => x !== d));
    }
  };

  const adicionarDiametroCustom = () => {
    const valor = parseInt(novoDiametro, 10);
    if (valor > 0 && valor <= 300 && !diametrosSelecionados.includes(valor)) {
      setDiametrosSelecionados([...diametrosSelecionados, valor].sort((a, b) => a - b));
      setNovoDiametro('');
    }
  };

  // Obter profundidades únicas para a tabela comparativa
  const profundidades = useMemo(() => {
    if (resultadosPorDiametro.length === 0) return [];
    return resultadosPorDiametro[0].cargas.map((c) => c.profundidadeAte);
  }, [resultadosPorDiametro]);

  const isRecomendacaoPositiva = analisePrincipal.recomendacao.startsWith('✓');
  const custoNumerico = custoM3 ? parseFloat(custoM3) : 0;

  return (
    <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm border border-border">
      <Text className="text-lg font-bold text-foreground mb-3">
        Análise de Profundidade
      </Text>

      {/* Campo de Carga do Projeto */}
      <View className="mb-4">
        <Text className="text-xs font-semibold text-muted mb-2">
          Carga do Projeto Estrutural (kN)
        </Text>
        <View className="flex-row items-center bg-background rounded-lg border border-border px-3 py-2">
          <MaterialIcons name="scale" size={18} color={colors.muted} />
          <TextInput
            className="flex-1 ml-2 text-foreground"
            placeholder="Ex: 500"
            placeholderTextColor={colors.muted}
            value={cargaProjeto}
            onChangeText={setCargaProjeto}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
        </View>
      </View>

      {/* Campo de Custo por m³ */}
      <View className="mb-4">
        <Text className="text-xs font-semibold text-muted mb-2">
          Custo do Concreto (R$/m³)
        </Text>
        <View className="flex-row items-center bg-background rounded-lg border border-border px-3 py-2">
          <MaterialIcons name="attach-money" size={18} color={colors.muted} />
          <TextInput
            className="flex-1 ml-2 text-foreground"
            placeholder="Ex: 450"
            placeholderTextColor={colors.muted}
            value={custoM3}
            onChangeText={setCustoM3}
            keyboardType="decimal-pad"
            returnKeyType="done"
          />
        </View>
        <Text className="text-xs text-muted mt-1">
          Opcional: insira o custo para calcular estimativa por estaca
        </Text>
      </View>

      {/* Seletor de Diâmetros */}
      <View className="mb-4">
        <Text className="text-xs font-semibold text-muted mb-2">
          Diâmetros para Comparação (cm)
        </Text>

        {/* Diâmetros selecionados */}
        <View className="flex-row flex-wrap gap-2 mb-3">
          {diametrosSelecionados.map((d, idx) => (
            <View
              key={d}
              className="flex-row items-center rounded-full px-3 py-1 border"
              style={{ borderColor: CORES_DIAMETROS[idx % CORES_DIAMETROS.length], backgroundColor: `${CORES_DIAMETROS[idx % CORES_DIAMETROS.length]}15` }}
            >
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: CORES_DIAMETROS[idx % CORES_DIAMETROS.length] }}
              />
              <Text className="text-xs font-bold text-foreground">Ø{d}</Text>
              {diametrosSelecionados.length > 1 && (
                <Pressable
                  onPress={() => removerDiametro(d)}
                  style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, marginLeft: 6 }]}
                >
                  <MaterialIcons name="close" size={14} color={colors.muted} />
                </Pressable>
              )}
            </View>
          ))}
        </View>

        {/* Adicionar diâmetros predefinidos */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {DIAMETROS_DISPONIVEIS.filter((d) => !diametrosSelecionados.includes(d)).map((d) => (
              <Pressable
                key={d}
                onPress={() => adicionarDiametro(d)}
                style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
              >
                <View className="bg-background border border-border rounded-full px-3 py-1">
                  <Text className="text-xs text-muted">+Ø{d}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        {/* Diâmetro customizado */}
        <View className="flex-row items-center gap-2 mt-3">
          <TextInput
            className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-foreground text-xs"
            placeholder="Diâmetro personalizado (cm)"
            placeholderTextColor={colors.muted}
            value={novoDiametro}
            onChangeText={setNovoDiametro}
            keyboardType="number-pad"
            returnKeyType="done"
            onSubmitEditing={adicionarDiametroCustom}
          />
          <Pressable
            onPress={adicionarDiametroCustom}
            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
          >
            <View className="bg-primary rounded-lg px-3 py-2">
              <Text className="text-xs font-bold text-white">Adicionar</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Card de Opção Mais Econômica */}
      {opcaoEconomica && (
        <View className="bg-success/10 rounded-lg p-4 mb-4 border border-success">
          <View className="flex-row items-center gap-2 mb-2">
            <MaterialIcons name="savings" size={20} color={colors.success} />
            <Text className="font-bold text-sm text-success">
              Opção Mais Econômica
            </Text>
          </View>
          <Text className="text-sm text-foreground leading-relaxed">
            Estaca Ø{opcaoEconomica.diametro}cm a {opcaoEconomica.profundidade.toFixed(2)}m
          </Text>
          <View className="flex-row flex-wrap gap-4 mt-2">
            <View>
              <Text className="text-xs text-muted">Padm</Text>
              <Text className="text-sm font-bold text-foreground">{opcaoEconomica.padm.toFixed(2)} kN</Text>
            </View>
            <View>
              <Text className="text-xs text-muted">Volume</Text>
              <Text className="text-sm font-bold text-foreground">{opcaoEconomica.volume.toFixed(4)} m³</Text>
            </View>
            {custoNumerico > 0 && (
              <View>
                <Text className="text-xs text-muted">Custo Est.</Text>
                <Text className="text-sm font-bold text-success">R$ {opcaoEconomica.custo.toFixed(2)}</Text>
              </View>
            )}
          </View>
          <Text className="text-xs text-muted mt-2">
            Menor volume de concreto que atende a carga de {cargaProjeto} kN
          </Text>
        </View>
      )}

      {/* Card de Recomendação */}
      <View
        className={cn(
          'rounded-lg p-4 mb-4 border-l-4',
          isRecomendacaoPositiva
            ? 'bg-success/10 border-success'
            : 'bg-warning/10 border-warning'
        )}
      >
        <View className="flex-row items-center gap-2 mb-2">
          <MaterialIcons
            name={isRecomendacaoPositiva ? 'check-circle' : 'info'}
            size={20}
            color={isRecomendacaoPositiva ? colors.success : colors.warning}
          />
          <Text
            className={cn(
              'font-bold text-sm',
              isRecomendacaoPositiva ? 'text-success' : 'text-warning'
            )}
          >
            Recomendação (Ø{diametrosSelecionados[0]}cm)
          </Text>
        </View>
        <Text className="text-sm text-foreground leading-relaxed">
          {analisePrincipal.recomendacao}
        </Text>
      </View>

      {/* Toggle Padm / Volume */}
      <View className="flex-row mb-3 bg-background rounded-lg p-1 border border-border">
        <Pressable
          onPress={() => setMostrarVolume(false)}
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}
        >
          <View className={cn('py-2 rounded-md items-center', !mostrarVolume && 'bg-primary')}>
            <Text className={cn('text-xs font-bold', !mostrarVolume ? 'text-white' : 'text-muted')}>
              Padm (kN)
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => setMostrarVolume(true)}
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.8 : 1 }]}
        >
          <View className={cn('py-2 rounded-md items-center', mostrarVolume && 'bg-primary')}>
            <Text className={cn('text-xs font-bold', mostrarVolume ? 'text-white' : 'text-muted')}>
              Volume (m³){custoNumerico > 0 ? ' / Custo' : ''}
            </Text>
          </View>
        </Pressable>
      </View>

      {/* Tabela Comparativa */}
      <View className="mb-4">
        <Text className="text-sm font-bold text-foreground mb-3">
          {mostrarVolume ? 'Volume de Concreto' : 'Padm (kN)'} por Profundidade × Diâmetro
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="border border-border rounded-lg"
        >
          <View>
            {/* Header */}
            <View className="flex-row bg-primary">
              <View className="w-16 px-2 py-2 justify-center items-center border-r border-white/20">
                <Text className="text-xs font-bold text-white">Prof. (m)</Text>
              </View>
              {diametrosSelecionados.map((d, idx) => (
                <View
                  key={d}
                  className="w-24 px-2 py-2 justify-center items-center"
                  style={{ backgroundColor: CORES_DIAMETROS[idx % CORES_DIAMETROS.length] }}
                >
                  <Text className="text-xs font-bold text-white">Ø{d}cm</Text>
                </View>
              ))}
            </View>

            {/* Dados */}
            {profundidades.map((prof, rowIdx) => {
              const cargaNum = cargaProjeto ? parseFloat(cargaProjeto) : 0;
              return (
                <View
                  key={rowIdx}
                  className={cn(
                    'flex-row border-b border-border',
                    rowIdx % 2 === 0 ? 'bg-background' : 'bg-surface'
                  )}
                >
                  <View className="w-16 px-2 py-2 justify-center items-center border-r border-border">
                    <Text className="text-xs font-semibold text-foreground">
                      {prof.toFixed(2)}
                    </Text>
                  </View>
                  {resultadosPorDiametro.map((resultado) => {
                    const cargaCamada = resultado.cargas[rowIdx];
                    const padmValor = cargaCamada ? cargaCamada.padm : 0;
                    const volume = calcularVolumeConcreto(resultado.diametro, prof);
                    const custo = volume * custoNumerico;
                    const atendeCarga = cargaNum > 0 && padmValor >= cargaNum;
                    const isEconomica =
                      opcaoEconomica &&
                      resultado.diametro === opcaoEconomica.diametro &&
                      Math.abs(prof - opcaoEconomica.profundidade) < 0.01;

                    return (
                      <View
                        key={resultado.diametro}
                        className={cn(
                          'w-24 px-1 py-2 justify-center items-center',
                          isEconomica && 'bg-success/20',
                          atendeCarga && !isEconomica && 'bg-primary/5'
                        )}
                      >
                        {mostrarVolume ? (
                          <View className="items-center">
                            <Text
                              className={cn(
                                'text-xs',
                                isEconomica ? 'font-bold text-success' : 'text-foreground'
                              )}
                            >
                              {volume.toFixed(3)}
                            </Text>
                            {custoNumerico > 0 && (
                              <Text className="text-xs text-muted">
                                R${custo.toFixed(0)}
                              </Text>
                            )}
                          </View>
                        ) : (
                          <Text
                            className={cn(
                              'text-xs',
                              isEconomica
                                ? 'font-bold text-success'
                                : atendeCarga
                                ? 'font-bold text-primary'
                                : 'text-foreground'
                            )}
                          >
                            {padmValor.toFixed(1)}
                          </Text>
                        )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Legenda da tabela */}
        <View className="flex-row flex-wrap gap-3 mt-3">
          {cargaProjeto && parseFloat(cargaProjeto) > 0 && (
            <>
              <View className="flex-row items-center gap-1">
                <View className="w-3 h-3 rounded bg-success/20" />
                <Text className="text-xs text-muted">Opção econômica</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <View className="w-3 h-3 rounded bg-primary/10" />
                <Text className="text-xs text-muted">Atende a carga</Text>
              </View>
            </>
          )}
        </View>
      </View>

      {/* Legenda Geral */}
      <View className="bg-background rounded-lg p-3 gap-2">
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="info" size={16} color={colors.muted} />
          <Text className="text-xs text-muted flex-1">
            <Text className="font-bold">Volume</Text> = π × (D/2)² × L (estaca cilíndrica)
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="info" size={16} color={colors.muted} />
          <Text className="text-xs text-muted flex-1">
            <Text className="font-bold">Opção Econômica</Text> = Menor volume que atende a carga
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <MaterialIcons name="info" size={16} color={colors.muted} />
          <Text className="text-xs text-muted flex-1">
            <Text className="font-bold">Padm</Text> = Carga admissível (FS = 2) pelo método Aoki-Velloso
          </Text>
        </View>
      </View>
    </View>
  );
}
