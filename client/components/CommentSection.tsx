import Comment from './Comment'
import { Comment as CommentType, CommentDraft } from '../../models/comment'
import { useComments } from '../hooks/useComments'
import * as Collapsible from '@radix-ui/react-collapsible'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { addComment } from '../apis/comments'

export function CommentSection({ postId }) {
  const queryClient = useQueryClient()
  const { data: comments, isPending, isError } = useComments(postId)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const { user, isAuthenticated } = useAuth0()
  const authId = user?.sub
  const [formData, setFormData] = useState({
    font: '',
    userId: '',
    message: '',
    image: '',
  })
  // const {
  //   data: userData,
  //   isPending: userLoading,
  //   isError: userError,
  // } = useQuery({
  //   queryKey: ['user', authId],
  //   queryFn: () => getUserById(authId),
  //   enabled: isAuthenticated && !!authId,
  // })

  useEffect(() => {
    if (user) {
      setFormData({
        userId: authId,
        message: '',
        image: '',
        postId: postId,
      })
    }
  }, [authId, postId, user])

  const addCommentMutation = useMutation({
    mutationFn: (newComment: CommentDraft) => addComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      setFormData({ ...formData, message: '' })
      setCommentsOpen(true)
    },
  })

  // if (userLoading) {
  //   return <p>Loading user data...</p>
  // }
  // if (userError) {
  //   return <p>Error loading user data.</p>
  // }

  if (isPending) {
    return <p>Loading comments...</p>
  }
  if (isError) {
    return <p>Error loading comments.</p>
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, message: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('hjelp')

    const newComment: CommentDraft = {
      postId: postId,
      userId: authId,
      message: formData.message,
      // image: formData.image,
    }

    try {
      await addCommentMutation.mutateAsync(newComment)
      console.log('mutating')
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  return (
    <div>
      {isAuthenticated && (
        <div className="m-2 rounded-lg border border-[#c7ef9f] bg-white p-2">
          <Collapsible.Root open={commentsOpen} onOpenChange={setCommentsOpen}>
            <Collapsible.CollapsibleTrigger asChild>
              <button>
                <i className="bi bi-chat-left-dots-fill relative top-0.5  text-2xl"></i>
              </button>
            </Collapsible.CollapsibleTrigger>
            <Collapsible.Content>
              <div className="mb-5 mt-2">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-row">
                    <input
                      type="text"
                      className=" w-full rounded-lg border border-[#c7ef9f] p-2 focus:outline-[#97d558]"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Add a comment..."
                    ></input>
                    <button type="submit">
                      <i className="bi bi-send relative top-0.5 ml-2 mr-2 text-xl"></i>
                    </button>
                  </div>
                </form>
              </div>
              {comments.map((comment: CommentType) => (
                <Comment key={comment.id} commentData={comment} />
              ))}
            </Collapsible.Content>
          </Collapsible.Root>
        </div>
      )}
    </div>
  )
}
