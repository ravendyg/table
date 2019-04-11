export enum EColor {
    ORANGE = '#ffa500',
    PURPLE = '551a8b',
    GREEN = '#00ff00',
    RED = '#ff0000',
    BLUE = '#0000ff',
}

export interface ICell {
    value: string;
    color: EColor;
    children: ICell[];
    verticalSpan?: number;
    horizontalSpan?: number;
}
