import { IHttpServer } from "@/core/ports/HttpServer";
import { IUserHistoryService } from "@/core/ports/UserHistoryService"

import e from 'express'
import bp from 'body-parser'


type Error = {
    status: number
    message: string
}


const errs = {
    userNotExist: 'User does not exist'
}


class NodejsHttpServer implements IHttpServer {
    private port: number
    private userHistService: IUserHistoryService
    private router: e.Router
    private app: e.Application

    constructor(port: number, userHistService: IUserHistoryService) {
        this.port = port
        this.userHistService = userHistService
        this.router = e.Router()
        this.app = e()
        this.app.use(bp.json())
    }

    public addUserLog(): void {
        this.router.post('/', (
            req: e.Request,
            res: e.Response,
            next: e.NextFunction,
        ) => {
            const errMsg = this.userHistService.addNewUserLog(req.body)
            if (errMsg) {
                const err: Error = { status: 400, message: errMsg }
                next(err) 
                return
            }
            res.sendStatus(200)
        })
    }

    public editUserLog(): void {
        this.router.patch('/:userId', async (
            req: e.Request,
            res: e.Response,
            next: e.NextFunction,
        ) => {
            const userId = +req.params.userId
            const userEdited = await this.userHistService.editUserLog(userId)
            if (!userEdited) {
                const err: Error = { status: 400, message: errs.userNotExist }
                next(err)
                return
            }
            res.sendStatus(200)
        })
    }

    public getHistory(): void {
        this.router.get('/', async (req: e.Request, res: e.Response) => {
            const page = req.query.page as string | null
            const userId = req.query.userId as string | null
            const userHistory = await this.userHistService.getUserHistory(
                page,
                userId,
            )
            res.json(userHistory)
        })
    }

    public run(): void {
        this.app.use('/user-history', this.router)
        this.router.use((
            err: Error,
            _: e.Request,
            res: e.Response,
            __: e.NextFunction
        ) => {
            console.error(err)
            res.status(err.status).send(err.message)
        })
        this.app.listen(this.port)
    }
}


export { NodejsHttpServer }
