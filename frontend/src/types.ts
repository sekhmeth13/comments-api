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
  }