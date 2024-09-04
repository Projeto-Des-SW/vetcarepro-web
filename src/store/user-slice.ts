import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserDataProps {
  email: string;
  token?: string;
  notifications: INotifications[];
}

interface INotifications {
  title: string;
  description: string;
}

const userInicialState: UserDataProps = {
  email: "admin@gmail.com",
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNjUwYWUyMy1kZjVkLTRhYTQtYThmNC1iMjhjNGE3MDQ4MWYiLCJpYXQiOjE3MjUxOTU5MzN9.suxA8pMjU8yvhGd4vWfuWPhrpEF6ZxG6CIWhmlWfIAw",
  notifications: [{ title: "", description: "" }],
};

const userSlice = createSlice({
  name: "user",
  initialState: userInicialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserDataProps>) {
      state.email = action.payload.email;
      state.token = action.payload.token;
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
  },
});

export default userSlice;
export const {
  setCurrentUser,
  logoutUser,
  addNotification,
  clearNotifications,
} = userSlice.actions;
