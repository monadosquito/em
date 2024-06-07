import { User, UserLog } from "@/core/User"
import { IUserHistoryRepo } from '@/core/ports/UserHistoryRepo'

import pg from 'pg'


type DbUserLog = {
    id: number
    user_id: number
    action: string
    email: string
    password: string
    last_name: string
    first_name: string
    middle_name: string
    prev_email: string
    prev_password: string
    prev_last_name: string
    prev_first_name: string
    prev_middle_name: string
}


const formatUserLog = ({
    id: _,
    action: __,
    user_id,
    email,
    password,
    last_name,
    first_name,
    middle_name,
    prev_email,
    prev_password,
    prev_last_name,
    prev_first_name,
    prev_middle_name,
}: DbUserLog): UserLog => ({
    to: {
        id: user_id,
        email,
        password,
        lastName: last_name,
        firstName: first_name,
        middleName: middle_name,
    },
    from: {
        id: user_id,
        email: prev_email,
        password: prev_password,
        lastName: prev_last_name,
        firstName: prev_first_name,
        middleName: prev_middle_name,
    },
})


class UserHistoryPostgresqlRepo implements IUserHistoryRepo {
    private pool: pg.Pool

    constructor(pool: pg.Pool) {
        this.pool = pool
    }

    private static formatUserLogs(dbUserLogs: DbUserLog[]) {
        const formattedUserLogs = dbUserLogs.map(formatUserLog)
        return formattedUserLogs
    }

    public addNewUserLog({ id: userId, ...newUser }: User): void {
        this.pool.query(
            'INSERT INTO user_log(\
                user_id, \
                action, \
                email, \
                password, \
                last_name, \
                first_name, \
                middle_name\
            ) \
            VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [ userId, 'add', ...Object.values(newUser) ],
        )
    }

    public async getUser(id: number): Promise<User> {
        const qry = await this.pool.query(
            'SELECT * FROM user_ WHERE id = $1',
            [ id ],
        )
        const user = qry.rows[0]
        return user
    }

    public async editUserLog({ id: userId, ...user }: User): Promise<void> {
        this.pool.query(
            'INSERT INTO user_log(\
                user_id, \
                action, \
                email, \
                password, \
                last_name, \
                first_name, \
                middle_name\
            ) \
            VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [ userId, 'edit', ...Object.values(user) ],
        )
    }

    public async getUserLogs(
        offset: number | null,
        limit: number | null,
        id: number,
    ): Promise<UserLog[]> {
        const userHistoryQry = await this.pool.query(
            'SELECT \
                *, \
                LAG(email) OVER() AS prev_email, \
                LAG(password) OVER() AS prev_password, \
                LAG(last_name) OVER() AS prev_last_name, \
                LAG(first_name) OVER() AS prev_first_name, \
                LAG(middle_name) OVER() AS prev_middle_name \
            FROM user_log \
            WHERE user_id = $1 \
            OFFSET $2 \
            LIMIT $3',
            [ id, offset, limit ],
        )
        const userHistory = userHistoryQry.rows
        const formattedUserHistory = UserHistoryPostgresqlRepo.formatUserLogs(
            userHistory
        )
        return formattedUserHistory
    }

    public async getAllUsersLogs(
        offset: number | null,
        limit: number | null,
    ): Promise<UserLog[]> {
        const allUsersHistoryQry = await this.pool.query(
            'SELECT \
                *, \
                LAG(email) OVER() AS prev_email, \
                LAG(password) OVER() AS prev_password, \
                LAG(last_name) OVER() AS prev_last_name, \
                LAG(first_name) OVER() AS prev_first_name, \
                LAG(middle_name) OVER() AS prev_middle_name \
            FROM user_log \
            OFFSET $1 \
            LIMIT $2',
            [ offset, limit ]
        )
        const allUsersHistory = allUsersHistoryQry.rows
        const formattedAllUsersHistory = UserHistoryPostgresqlRepo.formatUserLogs(
            allUsersHistory
        )
        return formattedAllUsersHistory
    }
}


export { UserHistoryPostgresqlRepo }
