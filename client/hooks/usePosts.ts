import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import request from 'superagent'

import * as API from '../apis/posts.ts'
import { Post, PostData, PostWithAuthor } from '../../models/post.ts'
import { fetchAllPosts, fetchPostByIdWithAuthor } from '../apis/posts'

export function usePosts() {
  const query = useQuery({ queryKey: ['posts'], queryFn: fetchAllPosts })
  return {
    ...query,
    add: useAddPost,
    // add more post queries/mutations here if needed later
  }
}

export function usePostsWithAuthor() {
  return useInfiniteQuery({
    queryKey: ['postsWithAuthor'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await request.get(
        `/api/v1/posts/withAuthor?limit=10&offset=${pageParam}`,
      )
      return response.body.posts as PostWithAuthor[]
    },
    getNextPageParam: (lastPage, allPages) => {
      // If we got less than 10, we're at the end
      if (lastPage.length < 10) return undefined
      return allPages.length * 10
    },
    initialPageParam: 0,
  })
}

export function useGetPostById(postId: PostWithAuthor['id']) {
  const query = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPostByIdWithAuthor(postId),
  })
  return {
    ...query,
  }
}

export function useAddPost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: PostData) => API.addPost(post),
    onSuccess: (_, variables) => {
      // Refresh the main feed to show the new post
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Refresh the user's profile page to show their new post
      queryClient.invalidateQueries({
        queryKey: ['profilePosts', variables.userId],
      })
    },
  })
}

export function useDeletePost() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (post: Post) => API.deletePost(post),
    onSuccess: (_, variables) => {
      // Refresh the main feed to show the new post
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      // Refresh the user's profile page to show their new post
      queryClient.invalidateQueries({
        queryKey: ['profilePosts', variables.userId],
      })
    },
  })
}
