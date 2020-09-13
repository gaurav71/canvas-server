import { MyContext } from "../types"
import { Middleware, NextFn } from "type-graphql/dist/interfaces/Middleware"
import { ResolverData } from "type-graphql"

export const isAuth: Middleware<MyContext> = 
({ context }: ResolverData<MyContext>, next: NextFn): Promise<any> => {

  // console.log(context.req.session)
  if (!context.req.user) {
    throw new Error('Not Authenticated')
  }

  return next()
}