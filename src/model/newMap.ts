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

    canPossitionValid(value: ITestPosition) {
        const exists = this.blocks.find(
            (b) => b.i == value.i && b.j == value.j
        );
        if (exists) return false;

        if (value.i == 0 || value.i == NewMap.WIDTH) {
            return true;
        }
        if (value.j == 0 || value.j == NewMap.HEIGHT) {
            return true;
        }
        if (value.j % 2 == 0 || value.i % 2 == 0) {
            return true;
        }

        // this.blocks.find(b => )

        // if (n == 0) {
        //     return true;
        // }
        // if (n == NewMap.WIDTH) {
        //     return true;
        // }
        // if (n == NewMap.HEIGHT) {
        //     return true;
        // }
        // //so pode soltar quando for par
        // if (n % 2 != 0) {
        //     return true;
        // }
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
}
