export type Comment = {
    id: string
    content: string
    originalCommentId: string | null
    authorId: string
    author: {
      nickname: string
    }
    article: {
      title: string
    }
    articleId: string
    createdAt: Date
    responses: Comment[]
  }

export type Article = {
  id: string
  title: 'article1' | 'article2'
  content: string
}