import pg from 'pg'

type UserEvent = {
  id: Number,
  userId: Number,
  event: String,
  createdAt: String,
}

type GetUserEventsResult = {
  userEvents: UserEvent[],
  total: Number,
}

export class UserEventModel {
  db: pg.PoolClient
  constructor(db: pg.PoolClient) {
    this.db = db
  }
  async create({userId, event}: {userId: Number, event: String}): Promise<Number> {
    try {
      const insertRes = await this.db.query(
        `INSERT INTO user_events (user_id, event) VALUES ($1, $2) RETURNING id`,
        [userId, event],
      )
      return insertRes.rows[0].id
    } catch (error) {
      console.error(error)
      throw new Error(`failed to create user event: ${(error as Error)}`)
    }
  }
  async get({userId, limit, offset}: {userId: Number, limit: Number, offset: Number}): Promise<GetUserEventsResult> {
    try {
      // setting default parameters
      limit ||= 5
      offset ||= 0

      let conditionFields: String[] = []
      let conditionValues: (String | Number)[] = []

      if (userId) {
        conditionFields.push('user_id')
        conditionValues.push(userId)
      }

      const conditions: String = conditionFields.map(
        (field: String, i: number) => `${field} = $${i + 1}`).join(' AND '
      )

      const fromClause = "FROM user_events"
      const whereClause = conditions ? 'WHERE '+conditions : ''

      const countSelectRes = await this.db.query(
        `SELECT count(1) as total ${fromClause} ${whereClause}`,
        conditionValues,
      )

      const limitNumber = conditionFields.length + 1
      const offsetNumber = conditionFields.length + 2

      const selectRes = await this.db.query(
        `SELECT * ${fromClause} ${whereClause} ORDER BY id LIMIT $${limitNumber} OFFSET $${offsetNumber}`,
        [...conditionValues, limit, offset])

      const userEvents: UserEvent[] = selectRes.rows.map((row) => {
        return {
          id: row.id,
          userId: row.user_id,
          event: row.event,
          createdAt: row.created_at,
        }
      })
      return {
        userEvents: userEvents,
        total: countSelectRes.rows[0].total
      }
    } catch (error) {
      console.error(error)
      throw new Error(`failed to get events for userId=${userId}: ${error}`)
    }
  }
}
