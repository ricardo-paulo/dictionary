import express from 'express'
import cors from 'cors'
import { termsRouter } from './routes/Terms.js'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
app.use('/api', termsRouter)

app.listen(port, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log(`O servidor está rodando na porta ${port}`)
  }
})