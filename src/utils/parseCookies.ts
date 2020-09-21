export const parseCookies = (req: any): Record<string, string> => {

  if (!req?.headers?.cookie) {
    return {}
  }

  const cookiesArr:any[] = req.headers.cookie.split(";")

  const cookies = cookiesArr.reduce((obj: any, cookie: string) => {
    cookie = cookie.trim()
    return {
      ...obj,
      [cookie.split('=')[0]]: cookie.split('=')[1]
    }
  }, {}) as Record<string, string>
  
  return cookies
}