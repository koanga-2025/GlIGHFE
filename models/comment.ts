export interface Comment {
  id: number
  postId: number
  userId: string
  message: string
  image: string
  font: string
  userName?: string
  profilePicture?: string
}

export interface CommentDraft {
  postId: number
  userId: string
  message: string
  image?: string
}
