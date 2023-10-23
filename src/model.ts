import pg from 'pg'

type UserFieldHistory = {
  fieldName: String,
  oldValue: String,
  newValue: String
}

type UserEvent = {
  id: Number,
  userId: Number,
  event: String,
  createdAt: String,
  changedFields: UserFieldHistory[],
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
  async create({userId, event, changedFields}: {userId: Number, event: String, changedFields: UserFieldHistory[]}): Promise<Number> {
    try {
      await this.db.query('BEGIN')
      const insertRes = await this.db.query(
        `INSERT INTO user_events (user_id, event) VALUES ($1, $2) RETURNING id`,
        [userId, event],
      )
      const userEventId = insertRes.rows[0].id
      for (const f of changedFields) {
        await this.db.query(
          `INSERT INTO user_field_history (user_event_id, field_name, old_value, new_value) VALUES ($1, $2, $3, $4) RETURNING id`,
          [userEventId, f.fieldName, f.oldValue, f.newValue],
        )
      }
      await this.db.query('COMMIT')
      return userEventId
    } catch (error) {
      console.error(error)
      throw new Error(`failed to create user event: ${(error as Error)}`)
    } finally {
      await this.db.query('ROLLBACK')
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
        `SELECT
          id,
          user_id AS "userId",
          event,
          created_at AS "createdAt"
        ${fromClause} ${whereClause}
        ORDER BY id
        LIMIT $${limitNumber} OFFSET $${offsetNumber}`,
        [...conditionValues, limit, offset]
      )

      let userEvents: UserEvent[] = []
      for (const row of selectRes.rows) {
        const fieldHistoryRes = await this.db.query(
          `SELECT
            field_name AS "fieldName",
            old_value AS "oldValue",
            new_value AS "newValue"
          FROM user_field_history
          WHERE user_event_id = $1`, [row.id])
        userEvents.push({...row, changedFields: fieldHistoryRes.rows})
      }
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
