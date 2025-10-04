import withAuth from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => !!token
    }
});

export const config = {
    matcher: [
        "/articles/create",
        "/api/comments/create", // protège la route de création de commentaire
    ]
}