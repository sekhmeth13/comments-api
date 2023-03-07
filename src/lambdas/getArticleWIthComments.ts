import type { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda"
import {z} from 'zod'
import articleRepository from '../lib/articles/article.repository'

export default async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const articleId = event.pathParameters?.articleId ?? ''

  if(!z.string().uuid().safeParse(articleId)){
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'invalid article uuid'
      })
    }
  }

  try {
    const article = await articleRepository.findOneWithComments(articleId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: article
      })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error
      })
    }
  }
}
