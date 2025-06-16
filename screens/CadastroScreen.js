// screens/CadastroScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebaseconfig';
import { useNavigation } from '@react-navigation/native';

export default function CadastroScreen() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const navigation = useNavigation();

  async function handleSalvar() {
    if (titulo === '' || autor === '') {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await addDoc(collection(db, 'livros'), {
        titulo,
        autor,
        status: 'disponível'
      });
      Alert.alert('Sucesso', 'Livro cadastrado com sucesso!');
      navigation.goBack(); // volta para Home
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Título:</Text>
      <TextInput
        style={styles.input}
        value={titulo}
        onChangeText={setTitulo}
        placeholder="Digite o título"
      />

      <Text style={styles.label}>Autor:</Text>
      <TextInput
        style={styles.input}
        value={autor}
        onChangeText={setAutor}
        placeholder="Digite o autor"
      />

      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  label: {
    fontSize: 16,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 8,
    borderRadius: 4,
    marginTop: 4
  }
});
