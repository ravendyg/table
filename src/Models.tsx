export const colors = {
    ORANGE: '#ffa500',
    PURPLE: '#551a8b',
    GREEN: '#00ff00',
    RED: '#ff0000',
    BLUE: '#0000ff',
};

export interface ICell {
    value: string;
    color: string;
    children: ICell[];
    verticalSpan?: number;
    horizontalSpan?: number;
}

export interface ITable {
    name: string;
    children: ICell[];
}

export enum ETrxType {
    INSERT_ABOVE = 'INSERT_ABOVE',
    INSERT_BELOW = 'INSERT_BELOW',
    INSERT_LEFT = 'INSERT_LEFT',
    INSERT_RIGHT = 'INSERT_RIGHT',
}

