export interface User {
  id: number
  authId: string
  name: string
  bio: string
  font: string
  profilePicture: string
}

export interface UserData {
  authId: string
  name: string
  bio?: string
  font?: string
  profilePicture?: string
}
