import { Comment as CommentType } from '../../models/comment'
import { Image } from 'cloudinary-react'

export function Comment({ commentData }: { commentData: CommentType }) {
  const publicId = commentData.profilePicture
  return (
    <div className="mb-2 flex flex-row rounded-lg border bg-white p-4">
      <Image
        className="rounded-full"
        cloudName="dfjgv0mp6"
        publicId={publicId}
        alt={commentData.userName + "'s profile"}
        width="100"
        crop="scale"
      />
      {commentData.message && (
        <p className="flex items-center justify-center">
          {commentData.message}
        </p>
      )}
    </div>
  )
}
export default Comment
