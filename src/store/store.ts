import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user-slice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

// Combine os reducers, mesmo que seja só um por enquanto
const rootReducer = combineReducers({
  user: userSlice.reducer,
});

// Configuração do persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Persiste o estado 'user'
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configura o store com o persistedReducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Necessário para evitar erros de serialização no persist
    }),
});

// Exporta o persistor
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
