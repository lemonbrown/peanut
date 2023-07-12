import PocketBase from "pocketbase"
import getPocketbase  from "$lib/PocketBaseFactory";

export async function load({ params }) {

    let pb = getPocketbase();

    await pb.admins.authWithPassword(import.meta.env.VITE_POCKETBASE_EMAIL, import.meta.env.VITE_POCKETBASE_PASSWORD);
	
    const chapters = await pb.collection("chapters").getFullList({
        sort: '-updated',
        expand: 'mangaId'
    });

	return {
		chapters: chapters.map((chap) => chap.export())
	};
}
