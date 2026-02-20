declare namespace Express {
  interface Request {
    requestId?: string
    userId?: number
    user?: {
      id: number
      email: string
      username: string
    }
  }
}
