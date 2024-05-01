import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  cartList: Array<[]>,
  userCartList: Array<[]>,
  isPaymentSucess: boolean,
  guestBookMarkedStallion: Array<[]>,
}

const initialState: CounterState = {
  cartList: [],
  userCartList: [],
  isPaymentSucess: false,
  guestBookMarkedStallion: [],
}

export const reportSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToReportCart: (state, action: PayloadAction<[]>) => {
      state.cartList = action.payload
    },
    addToUserReportCart: (state, action: PayloadAction<[]>) => {
      state.userCartList = action.payload
    },
    setIsPaymentSucess: (state, action: PayloadAction<boolean>) => {
      state.isPaymentSucess = action.payload
    },
    setGuestBookMarkedStallion: (state, action: PayloadAction<[]>) => {
      state.guestBookMarkedStallion = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addToReportCart, addToUserReportCart, setIsPaymentSucess, setGuestBookMarkedStallion } = reportSlice.actions       

export default reportSlice.reducer