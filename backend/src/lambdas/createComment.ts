import type { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda"
import commentRepository, {commentCreateInputSchema} from '../lib/comments/comment.repository'

export default async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  
  const input = JSON.parse(event.body ?? '')
  const inputCheckResult = commentCreateInputSchema.safeParse(input)
  if(!inputCheckResult.success){
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: inputCheckResult.error
      })
    }
  }
  
  try {
    const createdComment = await commentRepository.createOne(inputCheckResult.data)
    return {
      statusCode: 200,
      body: JSON.stringify({
        data: createdComment
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
