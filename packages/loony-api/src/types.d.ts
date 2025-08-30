// types.d.ts or any .d.ts file loaded by TypeScript
import "express-session"

declare module "express-session" {
  interface SessionData {
    user?: {
      uid: number
      username: string
      fname: string
      lname: string
      // add more fields as needed
    }
  }
}
