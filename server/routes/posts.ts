import { Router } from 'express'
import * as db from '../db/posts'
import { StatusCodes } from 'http-status-codes'
import { Post } from '../../models/post'

const router = Router()

// GET /api/v1/posts
router.get('/', async (req, res) => {
  try {
    const posts = await db.getAllPosts()
    res.json({ posts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/withAuthor', async (req, res) => {
  try {
    const posts = await db.getAllPostsWithAuthor()
    res.json({ posts })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.get('/:id/withAuthor', async (req, res) => {
  try {
    const postId = Number(req.params.id)
    const post = await db.getPostbyIdWithAuthor(postId)
    res.json({ post })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Something went wrong' })
  }
})

router.post('/', async (req, res) => {
  try {
    const newPost = await db.addPost(req.body)
    res.status(StatusCodes.CREATED).json(newPost)
  } catch (error) {
    console.error(error)
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Something went wrong' })
  }
})

router.delete('/', async (req, res) => {
  try {
    const post: Post = req.body
    const deletedPost = await db.deletePost(post)
    if (!deletedPost) {
      // Check if deletion was unsuccessful
      return res.send('post not found')
    }
    res.status(StatusCodes.NO_CONTENT).json(deletedPost)
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message)
    } else {
      console.error('something went wrong')
    }
    res.sendStatus(500)
  }
})

export default router
