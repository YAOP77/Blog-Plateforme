export type UserSafe = {
    id: string;
    username: string;
    email: string;
    avatar: string | null
}

export type ArticleType = {
    id: string;
    title: string;
    image: string | null;
    description: string;
    comment: CommentsType;
    userId: string;
    user?: UserSafe | null;
    createdAt: string;
    createAt?: string | null;
    deleteAt?: string | null;
}

export type CommentsType = {
    id: string;
    description: string;
    userId: string;
    user?: UserSafe | null;
    articleId: string;
    article?: ArticleType | null;
    createdAt: string;
    createAt?: string | null;
    deleteAt?: string | null;
}