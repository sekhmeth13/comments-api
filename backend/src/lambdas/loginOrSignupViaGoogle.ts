import type { 
  APIGatewayProxyEvent, 
  APIGatewayProxyResult 
} from "aws-lambda"
import {z} from 'zod'
import googleClient from "../lib/common/clients/google.client"
import userRepository, {UserCreateInputSchema} from "../lib/users/user.repository"

export default async function(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  
  const input = JSON.parse(event.body ?? '')

  const inputCheckResult = z.object({
    credential: z.string()
  }).safeParse(input)

  if(!inputCheckResult.success){
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: inputCheckResult.error
      })
    }
  }
  
  try {
   const userData = await googleClient.verify(inputCheckResult.data.credential)

   const expectedPayloadSchema = z.object({
    email: z.string().email(),
    given_name: z.string()
  }).parse(userData)

    const existingUser = await userRepository.findOneByEmail(expectedPayloadSchema.email)
    if(existingUser){
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: existingUser
        })
      }
    }
    const createdUser = await userRepository.createOne({
      email: expectedPayloadSchema.email,
      nickname: expectedPayloadSchema.given_name
     })
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: createdUser
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
