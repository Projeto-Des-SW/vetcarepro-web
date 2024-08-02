import { RootState } from "@reduxjs/toolkit/query";
import { type TypedUseSelectorHook, useSelector } from "react-redux";

export const useUserSelector: TypedUseSelectorHook<RootState> = useSelector;
