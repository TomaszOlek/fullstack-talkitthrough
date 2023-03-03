export type CommentsType = {
  id: string
  title: string
  postId: string
  user: {
    name: string
    image: string
    email: string
  }
}
