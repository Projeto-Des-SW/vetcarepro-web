import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserDataProps {
  email: string;
  token?: string;
  name?: string;
  isDarkMode: boolean;
  notifications: INotifications[];
}

interface INotifications {
  title: string;
  description: string;
}

const userInicialState: UserDataProps = {
  email: "vetCarePro@gmail.com",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjUwYWUyMy1kZjVkLTRhYTQtYThmNC1iMjhjNGE3MDQ4MWYiLCJpYXQiOjE3MjY0MTAyMjd9.-MYoS4XGHc6zva2T4-6Tcbx5ritfPBb3Sx1zhdWioxA",
  notifications: [{ title: "", description: "" }],
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
  },
});

export default userSlice;
export const {
  setCurrentUser,
  logoutUser,
  addNotification,
  clearNotifications,
  setDarkMode,
} = userSlice.actions;
