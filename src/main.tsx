import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Importa o React Query

// Cria uma instância do QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        {" "}
        {/* Envolve com QueryClientProvider */}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  </Provider>
);
