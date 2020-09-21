import { MongoStore } from "connect-mongo"
import { parseCookies } from "./parseCookies"

export const validateUserByCookies = async (req:any, store: MongoStore): Promise<boolean> => {
  const cookies = parseCookies(req)
  
  if (!cookies.qid) {
    return false
  }

  const { qid } = cookies
  const sessionStoreId = qid.slice(4, qid.length).split('.')[0]

  const session: any = await new Promise((resolve) => {
    store.get(sessionStoreId, (err, sess) => {
      resolve(sess)
    })
  })

  return !!session?.passport?.user
}