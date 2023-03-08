import type { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda"
import {z} from 'zod'
import { isNumeric } from "../lib/common/utils"
import commentRepository from '../lib/comments/comment.repository'

export default async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  
    const limit = event.queryStringParameters?.limit ?? '10'

    if(!isNumeric(limit) || !z.number().gte(1).lte(100).safeParse(limit)){
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'limit is not a number between 1 and 100'
        })
      }
    }

    try {
    const latestComments = await commentRepository.retrieveLatest(Number(limit))
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: latestComments
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
