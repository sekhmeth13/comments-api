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
            responses: {
              include: { 
                responses: {
                  include: { 
                    responses: {
                      include: { author: true },
                      orderBy: {
                        createdAt: 'desc'
                      }
                    },
                    author: true },
                    orderBy: {
                      createdAt: 'desc'
                    }
                },
                author: true },
                orderBy: {
                  createdAt: 'desc'
                }
            },
            author: true
          },
          where: {
            originalComment: null
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
  }
  async listAllArticles(){
    return this.databaseClient.article.findMany({
      select: {
        id: true,
        title: true
      }
    })
  }
}


export default new ArticleRepository(prismaClient)
