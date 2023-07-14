import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";

import { store,persistor } from "./Components/Features/Store.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <React.StrictMode>
      <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        </PersistGate>
      </BrowserRouter>
    </React.StrictMode>
  </Provider>
);
