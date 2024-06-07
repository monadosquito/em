import { User, UserLog } from "@/core/User"
import { Result, IUserValidator } from "@/core/ports/UserValidator"
import { IUserHistoryRepo } from "@/core/ports/UserHistoryRepo"
import { IUserHistoryService } from "@/core/ports/UserHistoryService"


class UserHistoryService implements IUserHistoryService {
    private logsPerPageCount: number
    private validator: IUserValidator
    private repo: IUserHistoryRepo

    constructor(
        logsPerPageCount: number,
        validator: IUserValidator,
        repo: IUserHistoryRepo,
    ) {
        this.logsPerPageCount = logsPerPageCount
        this.validator = validator
        this.repo = repo
    }

    public addNewUserLog(u: User): string | undefined {
        const { errorMessage, user } = this.validator.validate(u)
        if (!errorMessage) {
            this.repo.addNewUserLog(user)
        }
        return errorMessage
    }

    public async editUserLog(userId: number): Promise<boolean> {
        const user = await this.repo.getUser(userId)
        if (user) {
            this.repo.editUserLog(user)
        }
        const userEdited = !!user
        return userEdited
    }

    public async getUserHistory(
        pageStr: string | null,
        userIdStr: string | null,
    ): Promise<UserLog[]> {
        const userId = !isNaN(userIdStr as any)
                     && parseInt(userIdStr as any)
                     || null
        const page = !isNaN(pageStr as any)
                   && parseInt(pageStr as any)
                   || null
        const offset = page && (page - 1) * this.logsPerPageCount
        const limit = page && (this.logsPerPageCount as number)
        let history: UserLog[] = []
        if (userId) {
            history = await this.repo.getUserLogs(offset, limit, userId)
        } else {
            history = await this.repo.getAllUsersLogs(offset, limit)
        }
        return history
    }
}

export { UserHistoryService }
