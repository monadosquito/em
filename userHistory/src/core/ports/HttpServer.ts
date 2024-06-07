interface IHttpServer {
    addUserLog: () => void
    editUserLog: () => void
    getHistory: () => void
    run: () => void
}


export type { IHttpServer }
