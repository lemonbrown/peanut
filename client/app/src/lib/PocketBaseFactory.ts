import PocketBase from "pocketbase"


export default function getPocketbase(){

    let pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

    return pb;
}