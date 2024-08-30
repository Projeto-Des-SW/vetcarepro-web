import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserDataProps {
  email: string;
  token?: string;
}

const userInicialState: UserDataProps = {
  email: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: userInicialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserDataProps>) {
      state.email = action.payload.email;
      state.token = action.payload.token;
    },
  },
});

export default userSlice;
export const { setCurrentUser } = userSlice.actions;
