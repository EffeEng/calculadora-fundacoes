import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { exportarRelatorioPDF } from '@/lib/pdf-export';
import { Furo } from '@/lib/dados-furos';
import { Projeto } from '@/lib/tipos-projeto';

interface ExportadorRelatoriosProps {
  furo: Furo;
  projeto?: Projeto;
  diametro: number;
  padm: number;
  rp: number;
  rl: number;
  kv: number;
  kh: number;
}

export function ExportadorRelatorios({
  furo,
  projeto,
  diametro,
  padm,
  rp,
  rl,
  kv,
  kh,
}: ExportadorRelatoriosProps) {
  const [exportando, setExportando] = useState(false);

  const exportarRelatorioEstaca = async () => {
    try {
      setExportando(true);
      await exportarRelatorioPDF(furo, projeto, diametro, padm, rp, rl);
      Alert.alert('Sucesso', 'Relatório exportado em PDF com sucesso!');
    } catch (erro) {
      console.error('Erro ao exportar relatório em PDF:', erro);
      Alert.alert('Erro', 'Não foi possível exportar o relatório em PDF');
    } finally {
      setExportando(false);
    }
  };

  const exportarRelatorioFuro = async () => {
    try {
      setExportando(true);
      if (!projeto) {
        Alert.alert('Erro', 'Projeto não definido');
        return;
      }
      await exportarRelatorioPDF(furo, projeto, diametro, padm, rp, rl);
      Alert.alert('Sucesso', 'Relatório do furo exportado em PDF com sucesso!');
    } catch (erro) {
      console.error('Erro ao exportar relatório em PDF:', erro);
      Alert.alert('Erro', 'Não foi possível exportar o relatório em PDF');
    } finally {
      setExportando(false);
    }
  };

  return (
    <View className="bg-surface rounded-lg p-4 mb-4 shadow-sm border border-border">
      <Text className="text-lg font-bold text-foreground mb-3">Exportar Relatórios</Text>

      <View className="gap-2">
        <Pressable
          onPress={exportarRelatorioEstaca}
          disabled={exportando}
          className="bg-primary p-3 rounded-lg active:opacity-80"
        >
          <Text className="text-white text-center font-semibold">
            {exportando ? 'Exportando...' : 'Exportar Relatório de Estaca (HTML)'}
          </Text>
        </Pressable>

        {projeto && (
          <Pressable
            onPress={exportarRelatorioFuro}
            disabled={exportando}
            className="bg-primary/80 p-3 rounded-lg active:opacity-80"
          >
            <Text className="text-white text-center font-semibold">
              {exportando ? 'Exportando...' : 'Exportar Relatório de Furo (HTML)'}
            </Text>
          </Pressable>
        )}

        <Text className="text-xs text-muted mt-2 text-center">
          Os relatórios serão exportados em formato PDF e poderão ser compartilhados ou salvos no dispositivo.
        </Text>
      </View>
    </View>
  );
}
