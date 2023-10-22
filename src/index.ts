import express from 'express'
import pg from 'pg'

import { router } from './router.js'
import { UserEventModel } from './model.js'

const app = express()
const port = 8081

app.use(express.json())

const pool = new pg.Pool()
const client = await pool.connect()
const userEventModel = new UserEventModel(client)

app.set('userEventModel', userEventModel)

app.use('/', (req: express.Request, res: express.Response, next: express.NextFunction): any => {
  console.log(`${req.method} ${req.path} ${JSON.stringify(req.body)}`)
  next()
})

app.use('/', router)

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction): any => {
  console.error(err)
  res.status(500).json({
    error: "Internal server error"
  })
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
