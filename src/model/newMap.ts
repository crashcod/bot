import { Block } from "./block";
import { IMapBlockUpdateParams } from "./map";

interface ITestPosition {
    i: number;
    j: number;
}

export class NewMap {
    blocks: Block[] = [];
    static readonly WIDTH = 35;
    static readonly HEIGHT = 17;

    public update(value: Block[]) {
        this.blocks = value;
    }

    updateBlock(params: IMapBlockUpdateParams) {
        const block = this.blocks.findIndex(
            (v) => v.i == params.i && v.j == params.j
        );
        if (block !== -1) {
            this.blocks[block].updateHp(params.hp);
        }
    }

    get totalLife(): number {
        return this.blocks.reduce((total, block) => total + block.hp, 0);
    }

    get totalMaxLife(): number {
        return this.blocks.reduce((total, block) => total + block.maxHp, 0);
    }

    get blocksLife(): Block[] {
        return this.blocks
            .filter((v) => v.hp > 0)
            .sort((a, b) => (b.hp > a.hp ? 1 : -1));
    }

    canPossitionValid(value: ITestPosition) {
        const exists = this.blocksLife.find(
            (b) => b.i == value.i && b.j == value.j
        );
        if (exists) return false;

        if (value.i > NewMap.WIDTH - 1) {
            return false;
        }
        if (value.j > NewMap.HEIGHT - 1) {
            return false;
        }

        // if (value.i == 0 || value.i == NewMap.WIDTH - 1) {
        //     return true;
        // }
        // if (value.j == 0 || value.j == NewMap.HEIGHT - 1) {
        //     return true;
        // }
        if (value.j % 2 === 0) {
            return true;
        }
        if (value.i % 2 === 0) {
            return true;
        }
    }

    getPossitionValid(block: Block): { i: number; j: number } | undefined {
        if (this.canPossitionValid({ i: block.i + 1, j: block.j })) {
            return { i: block.i + 1, j: block.j };
        }
        if (this.canPossitionValid({ i: block.i - 1, j: block.j })) {
            return { i: block.i - 1, j: block.j };
        }
        if (this.canPossitionValid({ i: block.i, j: block.j + 1 })) {
            return { i: block.i, j: block.j + 1 };
        }
        if (this.canPossitionValid({ i: block.i, j: block.j - 1 })) {
            return { i: block.i, j: block.j - 1 };
        }
    }

    toString(): string {
        return `Map: ${this.totalLife}/${this.totalMaxLife}`;
    }

    formatMsgBlock() {
        const blocks = this.blocksLife.reduce(function (r, a) {
            r[a.type] = r[a.type] || [];
            r[a.type].push(a);
            return r;
        }, Object.create(null));

        return Object.keys(blocks).map(
            (type) => `${type}: ${blocks[type].length}\n`
        );
    }
}
