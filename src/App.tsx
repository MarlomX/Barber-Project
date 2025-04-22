import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SelectBarber from "./pages/SelectBarber";
import SelectHaircut from "./pages/SelectHaircut";
import ConfirmOrder from "./pages/ConfirmOrder";
import * as SQLite from 'expo-sqlite';
import { useEffect } from 'react';

// Criar uma variavel que abre o Banco de dados
const db = SQLite.openDatabaseSync('BarberDB.db');

//Função principal
export default function App() {
  // Amarzena qual tela sera mostrada para o usuario e começa definindo a pagina de login como a inicial
  const [page, setPage] = useState<"login" | "register" | "home"|
   "SelectBarber" | "SelectHaircut"| "ConfirmOrder">("login");

  const [userName, setUserName] = useState("");

  const [selectedBarber, setSelectedBarber] = useState<string>("");  
  
  const [selectedHaircut, setSelectedHaircut] = useState<string>("");


 // Configura o banco de dados garantindo a existencia da tabela cliente
  useEffect(() => {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS cliente (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL
      );
    `);
  }, []);

  //função caso login for bem sucedido
  const handleLoginSuccess = (name: string) => {
    setUserName(name);
    setPage("home");
  };

  // função para deslogar o usuario
  const handleLogout = () => {
    setPage("login");
    setUserName("");
  };

  // visualisação do aplicativo
  //dependendo do estado da variavel page muda a tela mostrada
  return (
    //
    <View style={styles.appContainer}>
      <Text style={styles.title}>Barber Studio 💈</Text>

    
      {page === "login" && (
        <Login 
          goToRegister={() => setPage("register")} 
          onSuccess={handleLoginSuccess} 
        />
      )}
      
      {page === "register" && (
        <Register goToLogin={() => setPage("login")} />
      )}
      
      {page === "home" && (
        <Home 
        userName={userName} 
        onLogout={handleLogout}
        goToSelectBarber={() => setPage("SelectBarber")}
        />
        )}

      {page === "SelectBarber" &&(
        <SelectBarber 
        onSelectBarber={(barbeiro) => setSelectedBarber(barbeiro)}
        goToSelectHaircut = {() => setPage("SelectHaircut")}
        goToBack = {() => setPage("home")}
        />
      )}

      {page === "SelectHaircut" &&(
        <SelectHaircut
        barber={selectedBarber}
        onSelectHaircut={(haircut) => setSelectedHaircut(haircut)}
        goToConfirmOrder={()=> setPage("ConfirmOrder")}
        goToBack={() => setPage("SelectBarber")}
        />
      )}

      {page === "ConfirmOrder" &&(
        <ConfirmOrder
        barber = {selectedBarber}
        haircut= {selectedHaircut}
        onConfirm={() => setPage("home")}
        goToBack={() => setPage("SelectHaircut")}
        />
      )}

    </View>
  );
}

//Estilos
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    textAlign: 'center',
    marginVertical: 20,
  },
});