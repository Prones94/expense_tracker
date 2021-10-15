import React, { useState, useContext, useEffect } from 'react'
import { ExpenseTrackerContext } from '../../context/context'
import { incomeCategories, expenseCategories } from '../../constants/categories'
import { v4 as uuidv4 } from 'uuid'
import { useSpeechContext } from '@speechly/react-client'

import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import useStyles from './FormStyles'
import formatDate from '../../utils/formatDate'

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date())
}

const Form = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState(initialState)
  const { addTransaction } = useContext(ExpenseTrackerContext)
  const { segment } = useSpeechContext()

  const createTransaction = () => {
    if(Number.isNan(Number(formData.amount)) || !formData.date.includes('-')) return;
    const transaction = { ...formData, amount: Number(formData.amount), id: uuidv4() }
    addTransaction(transaction)
    setFormData(initialState)
  }

  useEffect(() => {
    if (segment) {
      if (segment.intent.intent === 'add_expense') {
        setFormData({ ...formData, type: 'Expense' })
      } else if (segment.intent.intent === 'add_income') {
        setFormData({ ...formData, type: 'Income' })
      } else if (segment.isFinal && segment.intent.intent === "create_transaction") {
        return createTransaction();
      } else if (segment.isFinal && segment.intent.intent === "cancel_transaction") {
        return setFormData(initialState)
      }

      segment.entities.forEach((entity) => {
        const category = `${entity.value.charAt(0)}${entity.value.slice(1).toLowerCase()}`
        switch (entity.type) {
          case 'amount':
            setFormData({ ...formData, amount: entity.value })
            break;
          case 'category':
            if (incomeCategories.map(income => income.type).includes(category)) {
              setFormData({ ...formData, type: 'Income',category })
            } else if (expenseCategories.map(income => income.type).includes(category)){
              setFormData({ ...formData, type: 'Expense', category })
            }
            break;
          case 'date':
            setFormData({ ...formData, date: entity.value })
            break;
          default:
            break
        }
      });

      if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date){
        createTransaction()
      }
    }
  }, [segment])

  const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography align="center" variant="subtitle1" gutterBottom>
          {segment && segment.words.map((word) => word.value).join(" ")}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            {selectedCategories.map((category) => <MenuItem key={category.type} value={category.type}>{category.type}</MenuItem>)}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField type="number" label="Amount" fullWidth value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
      </Grid>
      <Grid item xs={6}>
        <TextField type="date" label="Date" fullWidth value={formData.date} onChange={(e) => setFormData({ ...formData, date: formatDate(e.target.value) })} />
      </Grid>
      <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={() => createTransaction()}>Create</Button>
    </Grid >
  )
}

export default Form
