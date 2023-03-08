import type { PrismaClient } from "@prisma/client"
import prismaClient from '../common/clients/prisma.client'

class ArticleRepository {
  constructor(private databaseClient: PrismaClient){}
  async findOneWithComments(articleId: string){
    return this.databaseClient.article.findUniqueOrThrow({
      where: {
        id: articleId
      },
      include: {
        comments: {
          include: {
            comments: {
              select: {
                author: true
              }
            },
            author: true
          }
        }
      }
    })
  }
}


export default new ArticleRepository(prismaClient)
