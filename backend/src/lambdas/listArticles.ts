import type { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda"
import articleRepository from '../lib/articles/article.repository'

export default async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  return {
    statusCode: 200,
    body: JSON.stringify({
      data: await articleRepository.listAllArticles()
    })
  }
  
}
