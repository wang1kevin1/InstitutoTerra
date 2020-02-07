const express = require('express')

const app = express()

app.get('/success', (req, res) => {
  res.send('')
  console.log('Payment Successful... Redirecting to Refloresta')
})

app.get('/cancelled', (req, res) => {
  res.send('')
  console.log('Payment Cancelled... Please Try Again')
})

const port = 3000

app.listen(port, () => console.log('Server running on port 3000'))