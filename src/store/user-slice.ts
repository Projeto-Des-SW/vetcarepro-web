import { IProduct } from "@/interfaces/product";
import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserDataProps {
  email: string;
  token?: string;
  name?: string;
  chavePix?: string;
  isDarkMode: boolean;
  cart: IProduct[];
  notifications: INotifications[];
}

interface INotifications {
  title: string;
  description: string;
}

//Todo o gerenciamento do usuario vai ser em apenas um slice.
//Ideal? não, mas 0 coragem de criar outra slice

const userInicialState: UserDataProps = {
  email: "",
  token: "",
  chavePix: "81998436108",
  notifications: [{ title: "", description: "" }],
  cart: [],
  isDarkMode: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: userInicialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserDataProps>) {
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.notifications = [{ title: "", description: "" }];
      state.isDarkMode = false;
    },
    logoutUser(state) {
      state.email = "";
      state.token = "";
    },
    addNotification(state, action: PayloadAction<INotifications>) {
      state.notifications.push(action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
    setDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    setChavePix(state, action: PayloadAction<string>) {
      state.chavePix = action.payload;
    },
    setItemCart(state, action: PayloadAction<IProduct>) {
      const existingProduct = state.cart.find(
        (item) => item.id === action.payload.id
      );
      if (existingProduct) {
        existingProduct.cartQuantity += 1;
      } else {
        state.cart.push({ ...action.payload, cartQuantity: 1 });
      }
    },

    setIncrementItemCart(state, action: PayloadAction<string>) {
      const existingProduct = state.cart.find(
        (item) => item.id === action.payload
      );
      if (existingProduct) {
        existingProduct.cartQuantity += 1;
      }
    },
    setDecrementItemCart(state, action: PayloadAction<string>) {
      const existingProduct = state.cart.find(
        (item) => item.id === action.payload
      );
      if (existingProduct) {
        existingProduct.cartQuantity -= 1;
      }
    },
    setRemoveItemCart(state, action: PayloadAction<string>) {
      const existingProduct = state.cart.findIndex(
        (item) => item.id === action.payload
      );

      if (existingProduct !== -1) {
        state.cart.splice(existingProduct, 1);
      }
    },
    setClearCart(state) {
      state.cart = [];
    },
  },
});

export default userSlice;
export const {
  setCurrentUser,
  logoutUser,
  addNotification,
  clearNotifications,
  setDarkMode,
  setChavePix,
  setItemCart,
  setClearCart,
  setIncrementItemCart,
  setDecrementItemCart,
  setRemoveItemCart,
} = userSlice.actions;
