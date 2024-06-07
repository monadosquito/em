type User = {
    id: number
    email: string
    password: string
    lastName: string
    firstName: string
    middleName: string
}

type UserLog = {
    from: User,
    to: User,
}


export type { User, UserLog }
