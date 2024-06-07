import { User } from '@/code/User'


type Result = {
    errorMessage: string | undefined
    user: User | undefined
}


interface IUserValidator {
    validate: (u: User) => Result
}


export type { Result, IUserValidator }
