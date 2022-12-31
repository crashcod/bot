import { Database } from "./database";

export class Notification {
    db: Database;
    constructor(db: Database) {
        this.db = db;
    }

    setUpdateVersion() {
        return this.db.set("updateVersion", true);
    }
    unsetUpdateVersion() {
        return this.db.set("updateVersion", false);
    }
    async hasUpdateVersion() {
        return (await this.db.get("updateVersion")) == true;
    }
    setHeroShield(heroId: number, shield: number) {
        return this.db.set(`heroShield${heroId}`, shield);
    }
    setHeroZeroShield(heroId: number, shield: number) {
        return this.db.set(`heroZeroShield${heroId}`, shield);
    }
    async hasHeroShield(heroId: number) {
        return (await this.db.get(`heroShield${heroId}`)) !== null;
    }
    async hasHeroZeroShield(heroId: number) {
        return (await this.db.get(`heroZeroShield${heroId}`)) !== null;
    }
    async checkHeroShield(heroId: number, shield: number) {
        const exists = await this.db.get(`heroShield${heroId}`);
        if (exists && shield > exists) {
            this.db.delete(`heroShield${heroId}`);
        }
        console.log(heroId, shield);
        const existsZero = await this.db.get(`heroZeroShield${heroId}`);
        if (existsZero && shield > 0) {
            this.db.delete(`heroZeroShield${heroId}`);
        }
    }
}
