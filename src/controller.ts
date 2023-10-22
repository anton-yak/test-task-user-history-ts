import express from 'express'

export async function createUserEvent(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const userEventModel = req.app.get('userEventModel')
    const eventId = await userEventModel.create(req.body)
    res.json({
      eventId: eventId,
    })
  } catch (error) {
    next(error)
  }
}

export async function getUserEvents(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const userEventModel = req.app.get('userEventModel')
    const userEvents = await userEventModel.get(req.query)
    res.json(userEvents)
  } catch (error) {
    next(error)
  }
}
