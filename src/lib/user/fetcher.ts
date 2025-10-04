export async function createUserRequest<T>(url: string, method: string, formData: FormData): Promise<T> {
    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnu");
    return data.data;
}