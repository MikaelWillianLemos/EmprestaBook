import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { db } from '../services/firebaseconfig';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function HomeScreen() {
  const [livros, setLivros] = useState([]);
  const navigation = useNavigation();


  async function loadLivros() {
    try {
      const livrosCollection = collection(db, 'livros');
      const querySnapshot = await getDocs(livrosCollection);

      const livrosFirebase = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setLivros(livrosFirebase);
    } catch (error) {
      console.log('Erro ao buscar livros do Firebase:', error);
    }
  }

  useFocusEffect(
  useCallback(() => {
    const livrosCollection = collection(db, 'livros');

    const unsubscribe = onSnapshot(livrosCollection, (snapshot) => {
      const livrosFirebase = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLivros(livrosFirebase);
    });
    return () => unsubscribe();
  }, [])
);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 EmprestaBook</Text>

      <FlatList
  data={livros}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => alternarStatus(item.id, item.status)}>
      <View style={styles.livroItem}>
        <Text style={styles.livroTitulo}>{item.titulo}</Text>
        <Text>{item.autor}</Text>
        <Text style={{
          color: item.status === 'disponível' ? 'green' : 'red',
          fontWeight: 'bold'
        }}>
          {item.status}
        </Text>
      </View>
    </TouchableOpacity>
  )}
  ListEmptyComponent={<Text style={styles.vazio}>Nenhum livro cadastrado.</Text>}
/>


      <TouchableOpacity
      style={styles.fab}
      onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
    </View>
  );
  
}

async function alternarStatus(id, statusAtual) {
  try {
    const novoStatus = statusAtual === 'disponível' ? 'emprestado' : 'disponível';

    const livroRef = doc(db, 'livros', id);
    await updateDoc(livroRef, { status: novoStatus });
    
    Alert.alert(
      'Status atualizado',
      `O livro foi marcado como "${novoStatus}".`
    );

  } catch (error) {
    console.log('Erro ao atualizar status do livro:', error)
    Alert.alert('Erro', 'Não foi possível atualizar o status.')
  }
  
}


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  livroItem: {
    padding: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  livroTitulo: { fontSize: 18, fontWeight: 'bold' },
  vazio: { textAlign: 'center', marginTop: 20, color: '#999' },
  botao: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  fab: {
  position: 'absolute',
  bottom: 30,
  right: 30,
  backgroundColor: '#0066cc',
  width: 60,
  height: 60,
  borderRadius: 30,
  alignItems: 'center',
  justifyContent: 'center',
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
},
fabText: {
  color: '#fff',
  fontSize: 30,
  lineHeight: 34,
},


});
