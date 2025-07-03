import { configureStore, createSlice } from '@reduxjs/toolkit';
import fakeData from '../data/data';

const defaultState = {
  employees: fakeData,
};

const loadData = () => {
  try {
    const serializedState = localStorage.getItem('employeesData');
    return serializedState ? JSON.parse(serializedState) : defaultState;
  } catch (err) {
    return defaultState;
  }
};

const saveData = (state) => {
  try {
    localStorage.setItem('employeesData', JSON.stringify(state));
  } catch (err) {
    console.error(err);
  }
};

const initialState = loadData();

const employeesSlice = createSlice({
  name: 'employees',
  initialState: initialState.employees,
  reducers: {
    addEmployee: (state, action) => {
      const newState = [action.payload, ...state];
      saveData({ employees: newState });
      return newState;
    },
    updateEmployee: (state, action) => {
      const index = state.findIndex((emp) => emp.id === action.payload.id);
      if (index === -1) {
        console.error(`Employee not found. Payload:`, action.payload);
      } else {
        state[index] = action.payload;
        saveData({ employees: state });
        return state;
      }
    },
    deleteEmployee: (state, action) => {
      const newState = state.filter((emp) => emp.id !== action.payload);
      saveData({ employees: newState });
      return newState;
    },
    deleteMultipleEmployees: (state, action) => {
      const newState = state.filter((emp) => !action.payload.includes(emp.id));
      saveData({ employees: newState });
      return newState;
    },
  },
});

export const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
  deleteMultipleEmployees,
} = employeesSlice.actions;

const store = configureStore({
  reducer: {
    employees: employeesSlice.reducer,
  },
});

export default store;
