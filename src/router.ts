import express from 'express'
import { createUserEvent, getUserEvents } from './controller.js'

const v1 = express.Router()
v1.post('/user-events', createUserEvent)
v1.get('/user-events', getUserEvents)

export const router = express.Router()
router.use('/api/v1', v1)
