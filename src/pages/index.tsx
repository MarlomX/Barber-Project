import React from "react";
import {AppRegistry} from 'react-native';
import App from "../App";

const Root = () => (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

AppRegistry.registerComponent('main', () => Root);