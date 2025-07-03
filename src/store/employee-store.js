import { configureStore, createSlice } from '@reduxjs/toolkit';
import fakeData from "../data/data";

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
      const employee = state.find((emp) => emp.id === action.payload.id);
      Object.assign(employee, action.payload);
      saveData({ employees: state });
    },
    deleteEmployee: (state, action) => {
      saveData({ employees: state.filter((emp) => emp.id !== action.payload) });
    },
    deleteMultipleEmployees: (state, action) => {
      const idsToDelete = action.payload;
      for (let i = state.length - 1; i >= 0; i--) {
        if (idsToDelete.includes(state[i].id)) {
          state.splice(i, 1);
        }
      }
      saveData({ employees: state });
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
