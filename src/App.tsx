import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import SelectBarber from "./pages/SelectBarber";
import SelectService from "./pages/SelectService";
import SelectDate from './pages/SelectDate'
import SelectTime from "./pages/SelectTime";
import ConfirmAppointment from "./pages/ConfirmAppointment";
import HistoryScreen from "./pages/History";
import { initDB } from "./database";

//Função principal
export default function App() {
  // Amarzena qual tela sera mostrada para o usuario e começa definindo a pagina de login como a inicial
  
  enum Pages {
    LOGIN = "Login",
    REGISTER = "register",
    HOME = "home",
    SELECTBARBER = "SelectBarber",
    SELECTSERVICE ="SelectService",
    SELECTDATE = "SelectDate",
    SELECTTIME = "SelectTime",
    CONFIRMAPPOINTMENT = "ConfirmAppointment",
    HISTORY = "History"
  }
  const [page, setPage] = useState<Pages>(Pages.LOGIN);

  const [selectClient, setSelectClient] = useState<number>();

  const [selectedBarber, setSelectedBarber] = useState<number>();  
  
  const [selectedService, setSelectedService] = useState<number>();

  const [selectDate, setSelectDate] = useState<string>();

  const [selectTime, setSelectTime] = useState<string>();

  const [scheduleId, setScheduleId] = useState<number>();

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


  // visualisação do aplicativo
  //dependendo do estado da variavel page muda a tela mostrada
  return (
    //
    <View style={styles.appContainer}>
    
      {page === Pages.LOGIN && (
        <Login 
          onSelectClient={(clientId) => setSelectClient(clientId)}
          goToRegister={() => setPage(Pages.REGISTER)} 
          onSuccess={() => setPage(Pages.HOME)} 
        />
      )}
      
      {page === Pages.REGISTER && (
        <Register goToLogin={() => setPage(Pages.LOGIN)} />
      )}
      
      {page === Pages.HOME && (
        <Home 
        client_id={selectClient} 
        onLogout={() => setPage(Pages.LOGIN)}
        goToSelectBarber={() => setPage(Pages.SELECTBARBER)}
        goToHistory={() => setPage(Pages.HISTORY)}
        />
        )}

      {page === Pages.SELECTBARBER &&(
        <SelectBarber 
        onSelectBarber={(barberId) => setSelectedBarber(barberId)}
        goToNext = {() => setPage(Pages.SELECTSERVICE)}
        goToBack = {() => setPage(Pages.HOME)}
        />
      )}

      {page === Pages.SELECTSERVICE &&(
        <SelectService
        barberId={selectedBarber}
        onSelectService={(serviceId) => setSelectedService(serviceId)}
        goToNext={()=> setPage(Pages.SELECTDATE)}
        goToBack={() => setPage(Pages.SELECTBARBER)}
        />
      )}

      {page === Pages.SELECTDATE &&(
        <SelectDate
        barberId={selectedBarber}
        onSelectDate={(selectDate) => setSelectDate(selectDate)}
        goToNext={()=> setPage(Pages.SELECTTIME)}
        goToBack={()=> setPage(Pages.SELECTSERVICE)}
        />
      )}

      {page === Pages.SELECTTIME &&(
        <SelectTime
        barberId={selectedBarber}
        selectedDate={selectDate}
        onSelectTime={(slot) => {
      setSelectTime(slot.time_slot);
      setScheduleId(slot.id); 
    }}
        goToNext={()=> setPage(Pages.CONFIRMAPPOINTMENT)}
        goToBack={()=> setPage(Pages.SELECTDATE)}
        />
      )}

      {page === Pages.CONFIRMAPPOINTMENT &&(
        <ConfirmAppointment
        barberId = {selectedBarber}
        clientId={selectClient}
        serviceId= {selectedService}
        scheduleId={scheduleId}
        date= {selectDate}
        time_slot= {selectTime}
        onConfirm={() => setPage(Pages.HOME)}
        goToBack={() => setPage(Pages.SELECTTIME)}
        />
      )}

      {page === Pages.HISTORY && (
        <HistoryScreen
          clientId = {selectClient}
          goToBack={() => setPage(Pages.HOME)}
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
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
    textAlign: 'center',
    marginVertical: 20,
  },
});