import {OAuth2Client} from 'google-auth-library'
import type {TokenPayload } from  'google-auth-library'
import {GOOGLE_CLIENT_ID} from '../../../../config'
export class GoogleAuthClient {
    constructor(private client: OAuth2Client ){}
    async verify(token: string): Promise<TokenPayload|void> {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });
        return ticket.getPayload();
      }
      
}
const client = new OAuth2Client(GOOGLE_CLIENT_ID)
export default new GoogleAuthClient(client)
