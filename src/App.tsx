import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

export default function App() {
  const [page, setPage] = useState<"login" | "register" | "home">("login");
  const [userName, setUserName] = useState("");

  // Função de login
  const handleLoginSuccess = (name: string) => {
    setUserName(name);
    setPage("home");
  };

  // Função de logout
  const handleLogout = () => {
    setPage("login");
    setUserName("");
  };

  return (
    <View style={styles.appContainer}>
      <Text style={styles.title}>Barber Studio💈</Text>

      {page === "login" && (
        <Login 
          goToRegister={() => setPage("register")} 
          onSuccess={handleLoginSuccess} 
        />
      )}
      
      {page === "register" && (
        <Register goToLogin={() => setPage("login")} />
      )}
      
      {page === "home" && <Home userName={userName} onLogout={handleLogout} />}
    </View>
  );
}

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