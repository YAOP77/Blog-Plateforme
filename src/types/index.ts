export type UserSafe = {
    id: string;
    username: string;
    email: string;
    avatar: string | null
}

export type ArticleType = {
    id: number;
    title: string;
    image: string | null;
    description: string;
    comment: CommentsType;
    userId: UserSafe;
    user?: UserSafe | null;
    createAt: string;
    deleteAt?: string | null;
}

export type CommentsType = {
    id: number;
    description: string;
    userId: string;
    user?: UserSafe | null;
    articleId: string;
    article?: ArticleType | null;
    createAt: string;
    deleteAt?: string | null;
}