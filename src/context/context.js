import React, { useReducer, createContext } from 'react'

const initialState = []

export const expenseTrackerContext = createContext((initialState))

export const Provider = ({ children }) => {
  return (
    <ExpenseTrackerContext.Provider value={{ appName: 'Expense Tracker'}}>
      { children }
    </ExpenseTrackerContext.Provider>
  )
}
