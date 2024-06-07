import { User, UserLog } from "@/core/User"


interface IUserHistoryRepo {
    addNewUserLog: (u: User) => void
    getUser: (id: number) => Promise<User>
    editUserLog: (u: User) => void
    getAllUsersLogs: (
        offset: number | null,
        limit: number | null,
    ) => Promise<UserLog[]>
    getUserLogs: (
        offset: number | null,
        limit: number | null,
        id: number,
    ) => Promise<UserLog[]>
}


export type { IUserHistoryRepo }
