import { User as prismaUser } from "@prisma/client";

declare global {
    namespace Express {
      interface User extends prismaUser {
        id: string
      }
    }
  }