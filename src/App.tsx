import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SelectBarber from "./pages/SelectBarber";
import SelectHaircut from "./pages/SelectHaircut";
import ConfirmOrder from "./pages/ConfirmOrder";
import { initDB } from "./database";

//Função principal
export default function App() {
  // Amarzena qual tela sera mostrada para o usuario e começa definindo a pagina de login como a inicial
  
  enum Pages {
    LOGIN = "Login",
    REGISTER = "register",
    HOME = "home",
    SELECTBARBER = "SelectBarber",
    SELECTHAIRCUT ="SelectHaircut",
    CONFIRMORDER = "ConfirmOrder"
  }
  const [page, setPage] = useState<Pages>(Pages.LOGIN);

  const [userName, setUserName] = useState("");

  const [selectedBarber, setSelectedBarber] = useState<number>();  
  
  const [selectedHaircut, setSelectedHaircut] = useState<string>("");

  const [isDBInitialized, setIsDBInitialized] = useState(false);


 // Inicialização do banco de dados
 useEffect(() => {
  const initializeDB = async () => {
    if (!isDBInitialized){
      try {
        await initDB(); // Aguarde a conclusão
        setIsDBInitialized(true);
        console.log("Banco de dados iniciado com sucesso")
      } catch(error){
        console.error("Erro ao iniciar o banco de dados: ", error)
      }
    }
  };
  
  initializeDB();
}, [isDBInitialized]);

  //função caso login for bem sucedido
  const handleLoginSuccess = (name: string) => {
    setUserName(name);
    setPage(Pages.HOME);
  };

  // função para deslogar o usuario
  const handleLogout = () => {
    setPage(Pages.LOGIN);
    setUserName("");
  };

  // visualisação do aplicativo
  //dependendo do estado da variavel page muda a tela mostrada
  return (
    //
    <View style={styles.appContainer}>
      <Text style={styles.title}>Barber Studio 💈</Text>

    
      {page === Pages.LOGIN && (
        <Login 
          goToRegister={() => setPage(Pages.REGISTER)} 
          onSuccess={handleLoginSuccess} 
        />
      )}
      
      {page === Pages.REGISTER && (
        <Register goToLogin={() => setPage(Pages.LOGIN)} />
      )}
      
      {page === Pages.HOME && (
        <Home 
        userName={userName} 
        onLogout={handleLogout}
        goToSelectBarber={() => setPage(Pages.SELECTBARBER)}
        />
        )}

      {page === Pages.SELECTBARBER &&(
        <SelectBarber 
        onSelectBarber={(barberId) => setSelectedBarber(barberId)}
        goToSelectHaircut = {() => setPage(Pages.SELECTHAIRCUT)}
        goToBack = {() => setPage(Pages.HOME)}
        />
      )}

      {page === Pages.SELECTHAIRCUT &&(
        <SelectHaircut
        barberId={selectedBarber}
        onSelectHaircut={(haircut) => setSelectedHaircut(haircut)}
        goToConfirmOrder={()=> setPage(Pages.CONFIRMORDER)}
        goToBack={() => setPage(Pages.SELECTBARBER)}
        />
      )}

      {page === Pages.CONFIRMORDER &&(
        <ConfirmOrder
        barberId = {selectedBarber}
        haircut= {selectedHaircut}
        onConfirm={() => setPage(Pages.HOME)}
        goToBack={() => setPage(Pages.SELECTHAIRCUT)}
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