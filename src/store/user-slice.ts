import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface UserDataProps {
  email: string;
}

const userInicialState: UserDataProps = {
  email: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: userInicialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<UserDataProps>) {
      state.email = action.payload.email;
    },
  },
});

export default userSlice;
export const { setCurrentUser } = userSlice.actions;
