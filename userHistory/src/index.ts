import p from 'pg'

import { UserHistoryService } from '@/core/adapters/UserHistoryService'
import { JoiUserValidator } from '@/adapters/JoiUserValidator'
import { UserHistoryPostgresqlRepo } from '@/adapters/UserHistoryPostgresqlRepo'
import { NodejsHttpServer } from '@/adapters/NodejsHttpServer'


const LOGS_PER_PAGE = 2

const pool = new p.Pool({
    user: 'em',
    password: '123',
})
const repo = new UserHistoryPostgresqlRepo(pool)
const joiUserValid = new JoiUserValidator()
const userHistService = new UserHistoryService(
    LOGS_PER_PAGE,
    joiUserValid,
    repo,
)
const httpServer = new NodejsHttpServer(8001, userHistService)
httpServer.addUserLog()
httpServer.editUserLog()
httpServer.getHistory()
httpServer.run()
