export function getPocketBaseImageUrl(collection: string, recordId: string, imageName: string): string {

    let imageUrl = import.meta.env.VITE_POCKETBASE_URL + "/api/files/" + collection + "/" + recordId + "/" + imageName;

    return imageUrl;
}