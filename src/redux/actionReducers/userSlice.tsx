
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface UserState {
  paymentDetails: Array<[]>,
  socialAccounts:  Array<[]>,
}

const initialState: UserState = {
  paymentDetails: [],
  socialAccounts: [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getPaymentDetails: (state, action: PayloadAction<[]>) => {
      state.paymentDetails = action.payload
    },
    addSocialAccounts: (state, action: PayloadAction<[]>) => {
      state.socialAccounts = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { getPaymentDetails, addSocialAccounts } = userSlice.actions

export default userSlice.reducer