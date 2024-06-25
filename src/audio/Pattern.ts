

export class Pattern<T extends string> {

    grid: boolean[][];
    labels: T[];

    onChange: () => void;

    constructor(options: { labels: T[], steps: number, default?: T[][] }, onChange: () => void) {
        this.labels = options.labels;
        this.grid = [];
        for (let i = 0; i < options.steps; i++) {
            this.grid.push(Array.from({ length: options.labels.length }).fill(false) as boolean[]);

            if (options.default && options.default[i]) {
                for (let j = 0; j < options.default[i].length; j++) {
                    const index = options.labels.indexOf(options.default[i][j]);

                    if (index > -1) {
                        this.grid[i][index] = true;
                    }
                }
            }

        }



        this.onChange = onChange
    }

    toggle(i: number, j: number) {
        this.grid[i][j] = !this.grid[i][j]
        this.onChange()
    }

    getRow(i: number): T[] {
        return this.grid[i].map((item, j): T | undefined => {
            if (item) {
                return this.labels[j];
            }
            return undefined;
        }).filter((label): label is T => label != null)
    }
}