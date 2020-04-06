import { createSlice } from '@reduxjs/toolkit';

export const slice = createSlice({
  name: 'ringer',
  initialState: {
    connected: false,
    numBells: 0,
    bellsAtHandstroke: [],
    bellOne: 0,
    bellTwo: 0,
  },
  reducers: {
    ringBell: (state, action) => {
      const bell = action.payload
      state.bellsAtHandstroke[bell - 1] = !state.bellsAtHandstroke[bell - 1]
    },
  },
  extraReducers: {
    'REDUX_WEBSOCKET::OPEN': (state, action) => {
      state.connected = true;
    },
    'REDUX_WEBSOCKET::MESSAGE': (state, action) => {
      const message = action.payload.message;
      const json = JSON.parse(message)
      switch (json.type) {
        case "SetBellsMessage":
          state.numBells = json.data.numBells
          state.bellOne = json.data.bellOne
          state.bellTwo = json.data.bellTwo
          while (state.bellsAtHandstroke.length < state.numBells) {
            state.bellsAtHandstroke.push(true)
          }
          break;
        case "RingBellMessage":
          const bell = json.data.bell
          state.bellsAtHandstroke[bell - 1] = !state.bellsAtHandstroke[bell - 1]
          break;
        default:
          break;
      }
    },
  }
});

export const { ringBell } = slice.actions;

export const selectConnected = state => state.ringer.connected;
export const selectNumBells = state => state.ringer.numBells;
export const selectBellsAtHandstroke = state => state.ringer.bellsAtHandstroke;
export const selectBellOne = state => state.ringer.bellOne;
export const selectBellTwo = state => state.ringer.bellTwo;

export default slice.reducer;
