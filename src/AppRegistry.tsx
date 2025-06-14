import React from "react";
import {AppRegistry} from 'react-native';
import App from "./App";

// Define a função App como o ponto inicial do programa
const Root = () => ( 
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

AppRegistry.registerComponent('barber_project', () => Root);