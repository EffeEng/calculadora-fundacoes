import React, { useState } from 'react';
import { View, Text, Pressable, FlatList, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import { useProjetos } from '@/lib/projetos-provider';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';
import { Projeto } from '@/lib/tipos-projeto';

export function ListaProjetos() {
  const router = useRouter();
  const { projetos, projetoAtivo, selecionarProjeto, deletarProjeto, duplicarProjeto, criarProjeto } = useProjetos();
  const colors = useColors();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busca, setBusca] = useState('');
  const [novoProjetoForm, setNovoProjetoForm] = useState({
    nome: '',
    local: '',
    proprietario: '',
    quantidadeFuros: '1',
    descricao: '',
  });

  const projetosFiltrados = projetos.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.local.toLowerCase().includes(busca.toLowerCase()) ||
      p.proprietario.toLowerCase().includes(busca.toLowerCase())
  );

  const handleSelecionarProjeto = (projetoId: string) => {
    router.push(`/detalhes-projeto?id=${projetoId}`);
  };

  const handleCriarProjeto = () => {
    if (!novoProjetoForm.nome || !novoProjetoForm.local || !novoProjetoForm.proprietario) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const novoProjeto: Omit<Projeto, 'id' | 'criadoEm' | 'atualizadoEm'> = {
      nome: novoProjetoForm.nome,
      local: novoProjetoForm.local,
      proprietario: novoProjetoForm.proprietario,
      quantidadeFuros: parseInt(novoProjetoForm.quantidadeFuros, 10),
      data: new Date().toISOString().split('T')[0],
      descricao: novoProjetoForm.descricao,
      furos: [],
    };

    criarProjeto(novoProjeto);
    setNovoProjetoForm({
      nome: '',
      local: '',
      proprietario: '',
      quantidadeFuros: '1',
      descricao: '',
    });
    setMostrarFormulario(false);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="bg-surface p-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground mb-4">
          Meus Projetos
        </Text>

        {/* Busca */}
        <View className="flex-row items-center bg-background rounded-lg border border-border px-3 py-2">
          <MaterialIcons name="search" size={20} color={colors.muted} />
          <TextInput
            className="flex-1 ml-2 text-foreground"
            placeholder="Buscar projetos..."
            placeholderTextColor={colors.muted}
            value={busca}
            onChangeText={setBusca}
          />
        </View>
      </View>

      {/* Lista de Projetos */}
      <FlatList
        data={projetosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelecionarProjeto(item.id)}
            className={cn(
              'mx-4 my-2 p-4 rounded-lg border',
              projetoAtivo === item.id
                ? 'bg-primary/10 border-primary'
                : 'bg-surface border-border'
            )}
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <Text
                  className={cn(
                    'text-lg font-bold',
                    projetoAtivo === item.id ? 'text-primary' : 'text-foreground'
                  )}
                >
                  {item.nome}
                </Text>
                <Text className="text-xs text-muted mt-1">
                  {item.local}
                </Text>
              </View>
              <View className="flex-row gap-1">
                <Pressable
                  onPress={() => duplicarProjeto(item.id)}
                  className="p-2 rounded-lg bg-blue-500/10"
                >
                  <MaterialIcons name="content-copy" size={16} color={colors.primary} />
                </Pressable>
                <Pressable
                  onPress={() => deletarProjeto(item.id)}
                  className="p-2 rounded-lg bg-error/10"
                >
                  <MaterialIcons name="delete" size={16} color={colors.error} />
                </Pressable>
              </View>
            </View>

            {/* Informações do Projeto */}
            <View className="gap-2 mt-3 pt-3 border-t border-border/50">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Proprietário:</Text>
                <Text className="text-xs font-semibold text-foreground">
                  {item.proprietario}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Furos:</Text>
                <Text className="text-xs font-semibold text-foreground">
                  {item.quantidadeFuros}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Data:</Text>
                <Text className="text-xs font-semibold text-foreground">
                  {new Date(item.data).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-8">
            <MaterialIcons name="folder-open" size={48} color={colors.muted} />
            <Text className="text-muted mt-4 text-center">
              Nenhum projeto encontrado
            </Text>
          </View>
        }
      />

      {/* Botão Novo Projeto */}
      <View className="p-4 border-t border-border">
        <Pressable
          onPress={() => setMostrarFormulario(!mostrarFormulario)}
          className="bg-primary rounded-lg py-3 flex-row items-center justify-center gap-2"
        >
          <MaterialIcons name="add" size={20} color="white" />
          <Text className="text-white font-semibold">
            {mostrarFormulario ? 'Cancelar' : 'Novo Projeto'}
          </Text>
        </Pressable>
      </View>

      {/* Formulário Novo Projeto */}
      {mostrarFormulario && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <ScrollView className="bg-surface border-t border-border p-4" keyboardShouldPersistTaps="handled">
          <Text className="text-lg font-bold text-foreground mb-4">
            Criar Novo Projeto
          </Text>

          <View className="gap-3">
            {/* Nome */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">
                Nome do Projeto *
              </Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Ex: Edifício Centro"
                placeholderTextColor={colors.muted}
                value={novoProjetoForm.nome}
                onChangeText={(text) =>
                  setNovoProjetoForm({ ...novoProjetoForm, nome: text })
                }
              />
            </View>

            {/* Local */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">
                Local *
              </Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Ex: Belo Horizonte, MG"
                placeholderTextColor={colors.muted}
                value={novoProjetoForm.local}
                onChangeText={(text) =>
                  setNovoProjetoForm({ ...novoProjetoForm, local: text })
                }
              />
            </View>

            {/* Proprietário */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">
                Proprietário *
              </Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Ex: Incorporadora XYZ"
                placeholderTextColor={colors.muted}
                value={novoProjetoForm.proprietario}
                onChangeText={(text) =>
                  setNovoProjetoForm({ ...novoProjetoForm, proprietario: text })
                }
              />
            </View>

            {/* Quantidade de Furos */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">
                Quantidade de Furos
              </Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="1"
                placeholderTextColor={colors.muted}
                value={novoProjetoForm.quantidadeFuros}
                onChangeText={(text) =>
                  setNovoProjetoForm({ ...novoProjetoForm, quantidadeFuros: text })
                }
                keyboardType="number-pad"
              />
            </View>

            {/* Descrição */}
            <View>
              <Text className="text-xs font-semibold text-muted mb-1">
                Descrição
              </Text>
              <TextInput
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                placeholder="Informações adicionais..."
                placeholderTextColor={colors.muted}
                value={novoProjetoForm.descricao}
                onChangeText={(text) =>
                  setNovoProjetoForm({ ...novoProjetoForm, descricao: text })
                }
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Botão Criar */}
            <Pressable
              onPress={handleCriarProjeto}
              className="bg-primary rounded-lg py-3 mt-2"
            >
              <Text className="text-white font-semibold text-center">
                Criar Projeto
              </Text>
            </Pressable>
          </View>
        </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
}
