import { User, UserLog } from "@/core/User"


interface IUserHistoryService {
    addNewUserLog: (u: User) => string | undefined
    editUserLog: (userId: number) => Promise<boolean>
    getUserHistory: (
        page: string | null,
        userId: string | null,
    ) => Promise<UserLog[]>
}


export type { IUserHistoryService }
