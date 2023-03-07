import type { PrismaClient } from "@prisma/client"
import prismaClient from '../common/clients/prisma.client'
import {z} from 'zod'

export const commentCreateInputSchema = z.object({
  authorId: z.string().uuid(),
  content: z.string().max(280),
  articleId: z.string().uuid(),
  originalCommentId: z.string().uuid().optional()
})

export type CommentCreateInput = z.infer<typeof commentCreateInputSchema>

class CommentRepository {
  constructor(private databaseClient: PrismaClient){}
  async retrieveLatest(limit: number){
    return this.databaseClient.comment.findMany({ 
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,

    })
  }

  async createOne(input: CommentCreateInput){

    return this.databaseClient.comment.create({
      data: {
        articleId: input.articleId,
        authorId: input.authorId,
        content: input.content,
        originalCommentId: input.originalCommentId ?? null
      }
    })
  }
}


export default new CommentRepository(prismaClient)
