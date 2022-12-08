import { Config, JsonDB } from "node-json-db";

export class Database {
    identify: string;
    db: JsonDB;
    constructor(wallet: string) {
        this.identify = wallet;
        this.db = new JsonDB(new Config("database.json", true, false, "/"));
    }

    public set(name: string, value: any) {
        return this.db.push(`/${this.identify}/${name}`, value);
    }
    public async get(name: string) {
        try {
            return await this.db.getData(`/${this.identify}/${name}`);
        } catch (e: any) {
            return null;
        }
    }
    public async delete(name: string) {
        try {
            return await this.db.delete(`/${this.identify}/${name}`);
        } catch (e: any) {
            return null;
        }
    }
}
