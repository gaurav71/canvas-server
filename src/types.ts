import { Request } from "express";

export interface MyContext {
  req: Request & { session: SessionType },
  res: ResponseType
}

interface SessionType extends Express.Session {
  userId: string
}
