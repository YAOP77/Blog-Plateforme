export async function getRequest<T>(url :string): Promise<T> {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Réponse inattendue du serveur");
    }
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || data.message || "Erreur inconnue");
    return data.data ?? data;
}

export async function createRequest<T>(url: string, method: string, formData: FormData): Promise<T> {
    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnue");
    return data.data;
}

export async function updateRequest<T>(url: string, method: string, formData: FormData): Promise<T> {
    const res = await fetch(url, { method, body: formData });
    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnue");
    return data.data;
}

export async function deleteRequest(url: string, method: string): Promise<void> {
    const res = await fetch(url, { method });
    const data = await res.json();

    if(!res.ok) throw new Error(data.message || "Erreur inconnue");
    return data.data;
}