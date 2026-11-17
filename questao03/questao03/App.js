import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const LIMITE_ALERTA = 5;

// Converte texto em número inteiro; retorna NaN se não for um inteiro válido
function inteiro(texto) {
  const limpo = texto.trim();
  if (limpo === '' || !/^-?\d+$/.test(limpo)) return NaN;
  return Number(limpo);
}

export default function App() {
  const [nome, setNome] = useState('');
  const [inicial, setInicial] = useState('');
  const [movimento, setMovimento] = useState('');

  const [produto, setProduto] = useState(null); // { nome, quantidade }
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');

  function iniciar() {
    setMensagem('');
    if (nome.trim() === '') {
      setErro('Informe o nome do produto.');
      return;
    }
    const qtd = inteiro(inicial);
    if (Number.isNaN(qtd) || qtd < 0) {
      setErro('A quantidade inicial deve ser um número inteiro maior ou igual a zero.');
      return;
    }
    setErro('');
    setProduto({ nome: nome.trim(), quantidade: qtd });
  }

  function lerMovimento() {
    const qtd = inteiro(movimento);
    if (Number.isNaN(qtd) || qtd <= 0) {
      setErro('A movimentação deve ser um número inteiro maior que zero.');
      setMensagem('');
      return null;
    }
    return qtd;
  }

  function adicionar() {
    const qtd = lerMovimento();
    if (qtd === null) return;
    setProduto({ ...produto, quantidade: produto.quantidade + qtd });
    setErro('');
    setMensagem(`${qtd} unidade(s) adicionada(s).`);
    setMovimento('');
  }

  function retirar() {
    const qtd = lerMovimento();
    if (qtd === null) return;
    if (qtd > produto.quantidade) {
      setErro(`Retirada maior que o estoque. Disponível: ${produto.quantidade} unidade(s).`);
      setMensagem('');
      return;
    }
    setProduto({ ...produto, quantidade: produto.quantidade - qtd });
    setErro('');
    setMensagem(`${qtd} unidade(s) retirada(s).`);
    setMovimento('');
  }

  function reiniciar() {
    setProduto(null);
    setNome('');
    setInicial('');
    setMovimento('');
    setErro('');
    setMensagem('');
  }

  const estoqueBaixo = produto !== null && produto.quantidade < LIMITE_ALERTA;

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Controle de estoque</Text>
        <Text style={styles.subtitulo}>
          Acompanhe a quantidade disponível de um produto.
        </Text>

        {produto === null ? (
          <>
            <Text style={styles.label}>Nome do produto</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Caderno"
              placeholderTextColor="#9a9a9a"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={[styles.label, styles.espaco]}>Quantidade inicial</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 20"
              placeholderTextColor="#9a9a9a"
              keyboardType="number-pad"
              value={inicial}
              onChangeText={setInicial}
            />

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}

            <Pressable
              style={({ pressed }) => [styles.botao, styles.espacoBotao, pressed && styles.pressionado]}
              onPress={iniciar}
            >
              <Text style={styles.botaoTexto}>Iniciar controle</Text>
            </Pressable>
          </>
        ) : (
          <>
            <View style={[styles.cartao, estoqueBaixo && styles.cartaoAlerta]}>
              <Text style={styles.cartaoNome}>{produto.nome}</Text>
              <Text style={styles.cartaoLabel}>Disponível em estoque</Text>
              <Text style={[styles.cartaoQtd, estoqueBaixo && styles.textoAlerta]}>
                {produto.quantidade}
              </Text>
              <Text style={styles.cartaoLabel}>
                {produto.quantidade === 1 ? 'unidade' : 'unidades'}
              </Text>
            </View>

            {estoqueBaixo && (
              <View style={styles.alerta}>
                <Text style={styles.alertaTexto}>
                  Atenção: restam menos de {LIMITE_ALERTA} unidades. Reponha o estoque.
                </Text>
              </View>
            )}

            <Text style={[styles.label, styles.espaco]}>Movimentação (unidades)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: 7"
              placeholderTextColor="#9a9a9a"
              keyboardType="number-pad"
              value={movimento}
              onChangeText={setMovimento}
            />

            {erro !== '' && <Text style={styles.erro}>{erro}</Text>}
            {mensagem !== '' && <Text style={styles.sucesso}>{mensagem}</Text>}

            <View style={styles.botoes}>
              <Pressable
                style={({ pressed }) => [styles.botao, pressed && styles.pressionado]}
                onPress={adicionar}
              >
                <Text style={styles.botaoTexto}>Adicionar estoque</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [styles.botao, styles.botaoRetirar, pressed && styles.pressionado]}
                onPress={retirar}
              >
                <Text style={styles.botaoTexto}>Retirar estoque</Text>
              </Pressable>
            </View>

            <Pressable
              style={({ pressed }) => [styles.botaoLink, pressed && styles.pressionado]}
              onPress={reiniciar}
            >
              <Text style={styles.botaoLinkTexto}>Trocar de produto</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#f5f3ef' },
  container: { padding: 24, paddingTop: 56 },
  titulo: { fontSize: 28, fontWeight: '700', color: '#2b2a33' },
  subtitulo: { fontSize: 15, color: '#6a6874', marginTop: 4, marginBottom: 24 },
  label: { fontSize: 15, fontWeight: '600', color: '#2b2a33', marginBottom: 6 },
  espaco: { marginTop: 16 },
  espacoBotao: { marginTop: 20 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d8d5cf',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 17,
    color: '#2b2a33',
  },
  erro: { color: '#b3261e', marginTop: 12, fontSize: 14 },
  sucesso: { color: '#2e6b43', marginTop: 12, fontSize: 14 },
  botoes: { flexDirection: 'row', gap: 12, marginTop: 20 },
  botao: {
    flex: 1,
    backgroundColor: '#2e6b43',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  botaoRetirar: { backgroundColor: '#b3501e' },
  pressionado: { opacity: 0.8 },
  botaoTexto: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
  botaoLink: { alignItems: 'center', marginTop: 24, padding: 8 },
  botaoLinkTexto: { color: '#4a4a57', fontSize: 15, textDecorationLine: 'underline' },
  cartao: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d8d5cf',
  },
  cartaoAlerta: { borderColor: '#b3261e' },
  cartaoNome: { fontSize: 20, fontWeight: '700', color: '#2b2a33', marginBottom: 8 },
  cartaoLabel: { fontSize: 14, color: '#6a6874' },
  cartaoQtd: { fontSize: 56, fontWeight: '700', color: '#2b2a33' },
  textoAlerta: { color: '#b3261e' },
  alerta: {
    backgroundColor: '#fdecea',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
  },
  alertaTexto: { color: '#8c1d18', fontSize: 14, fontWeight: '600' },
});