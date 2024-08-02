import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "./store"; // Certifique-se de que o caminho está correto

export const useUserSelector: TypedUseSelectorHook<RootState> = useSelector;
