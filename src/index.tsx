// require('dotenv').config()
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
import { ChakraProvider } from "@chakra-ui/react";
import "./index.css"
import axios from "axios";
axios.defaults.withCredentials = true
axios.defaults.baseURL = process.env.REACT_APP_URL

 
ReactDOM.render(
  
  <React.StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <App />
      </ChakraProvider>
    </Provider>
   
  </React.StrictMode>,
  document.getElementById("root")
);
