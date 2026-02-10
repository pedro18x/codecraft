declare namespace Express {
  interface Request {
    userId?: number
    user?: {
      id: number
      email: string
      username: string
    }
  }
}
