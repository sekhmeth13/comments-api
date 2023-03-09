import type { PrismaClient } from "@prisma/client"
import prismaClient from '../common/clients/prisma.client'
import {z} from 'zod'

export const UserCreateInputSchema = z.object({
  email: z.string().email(),
  nickname: z.string()
})

export type UserCreateInput = z.infer<typeof UserCreateInputSchema>

class UserRepository {
  constructor(private databaseClient: PrismaClient){}
  async findOneByEmail (email: string){
    return this.databaseClient.user.findUnique({ 
      where: {
        email
      }
    })
  }

  async createOne({email, nickname}: UserCreateInput){

    return this.databaseClient.user.create({
      data: {
        email,
        nickname
      }
    })
  }
}


export default new UserRepository(prismaClient)
