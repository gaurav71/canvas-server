import { Resolver, Query, Ctx, Mutation } from "type-graphql";
import { MyContext } from "../types";

@Resolver()
export class UserResolver {
  
  @Query(() => Boolean)
  isLogin(@Ctx() { req }: MyContext): boolean {
    return !!req.user
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req }: MyContext): Promise<boolean> {
    req.logout()
    return true
  }
  
}