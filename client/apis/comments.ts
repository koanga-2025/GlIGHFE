import request from 'superagent'
import { Comment, CommentDraft } from '../../models/comment'

const rootUrl = '/api/v1/comments'

export async function getCommentsByPostId(id: number) {
  const response = await request.get(`${rootUrl}/posts/${id}`)
  return response.body
}

export async function getCommentsByUserId(id: number) {
  const response = await request.get(`${rootUrl}/users/${id}`)
  return response.body
}

export async function addComment(commentData: CommentDraft) {
  const response = await request.post(`${rootUrl}`).send(commentData)
  return response.body
}

export async function editComment(id: number, commentData: Comment) {
  const response = await request.patch(`${rootUrl}/${id}`).send(commentData)
  return response.body
}

export async function deleteComment(id: number) {
  return await request.delete(`${rootUrl}/${id}`)
}
