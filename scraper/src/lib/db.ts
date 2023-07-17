
export function getDatabase() : Database {

    return new Database();
}

export class Database {

    save = (data : any) => "";

}

export function save(data: any) : void {

    getDatabase().save(data);
}