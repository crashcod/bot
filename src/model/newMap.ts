import { Block } from "./block";
import { IMapBlockUpdateParams } from "./map";

export class NewMap {
    blocks: Block[] = [];

    public update(value: Block[]) {
        this.blocks = value;
    }

    updateBlock(params: IMapBlockUpdateParams) {
        const block = this.blocks.find(
            (v) => v.i == params.i && v.j == params.j
        );
        if (block) {
            block.updateHp(params.hp);
        }
    }

    get totalLife(): number {
        return this.blocks.reduce((total, block) => total + block.hp, 0);
    }

    get totalMaxLife(): number {
        return this.blocks.reduce((total, block) => total + block.maxHp, 0);
    }

    get blocksLife(): Block[] {
        return this.blocks.filter((v) => v.hp > 0);
    }

    toString(): string {
        return `Map: ${this.totalLife}/${this.totalMaxLife}`;
    }
}
