import request from 'superagent'
import { User, UserData } from '../../models/user'

const rootURL = new URL(`/api/v1`, document.baseURI)

export async function getUserById(authId: string): Promise<User> {
  const response = await request.get(`${rootURL}/users/${authId}`)
  return response.body
}

export async function createUser(userData: UserData): Promise<void> {
  await request.post(`${rootURL}/users`).send(userData)
}
