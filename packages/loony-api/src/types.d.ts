// types.d.ts or any .d.ts file loaded by TypeScript
import "express-session"

declare module "express-session" {
  interface SessionData {
    user?: {
      id: number
      username: string
      // add more fields as needed
    }
  }
}
