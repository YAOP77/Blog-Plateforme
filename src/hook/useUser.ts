import { createUserRequest } from "@/lib/user/fetcher";

export async function useCreateUser(playload: {
    username: string,
    email: string,
    avatar?: File | null,
    password: string
}) {
    const formData = new FormData();
    formData.append("username", playload.username);
    formData.append("email", playload.email);
    if(playload.avatar) formData.append("avatar", playload.avatar);

    const data = await createUserRequest(`/api/user/`, "POST", formData);
    return data;
}