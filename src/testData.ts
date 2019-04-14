import { ITable, colors } from './Models';

export const defaultTables: ITable[] = [
    {
        name: 'Table 1',
        children: [
            {
                color: colors.ORANGE,
                value: '1',
                children: [
                    {
                        color: colors.GREEN,
                        value: '4',
                        children: [{
                            color: colors.PURPLE,
                            value: '7',
                            children: [],
                        }],
                    }, {
                        color: colors.GREEN,
                        value: '5',
                        children: [{
                            color: colors.PURPLE,
                            value: '8',
                            children: [],
                        }],
                    }
                ],
            }, {
                color: colors.ORANGE,
                value: '2',
                children: [
                    {
                        color: colors.GREEN,
                        value: '6',
                        verticalSpan: 2,
                        children: [],
                    }
                ],
            }, {
                color: colors.ORANGE,
                value: '3',
                verticalSpan: 2,
                horizontalSpan: 4,
                children: [
                    {
                        color: colors.PURPLE,
                        value: '9',
                        horizontalSpan: 2,
                        children: [],
                    }, {
                        color: colors.PURPLE,
                        value: '10',
                        children: [],
                    },
                ],
            },
        ],
    }, {
        name: 'Table 2',
        children: [
            {
                value: '1',
                color: colors.BLUE,
                children: [],
                horizontalSpan: 2,
                verticalSpan: 5,
            }, {
                value: '2',
                color: colors.GREEN,
                children: [
                    {
                        value: '3',
                        color: colors.ORANGE,
                        children: [],
                        horizontalSpan: 2,
                        verticalSpan: 4,
                    }, {
                        value: '4',
                        color: colors.PURPLE,
                        children: [
                            {
                                value: '5',
                                color: colors.RED,
                                children: [],
                                horizontalSpan: 2,
                                verticalSpan: 3,
                            }, {
                                value: '6',
                                color: colors.BLUE,
                                children: [
                                    {
                                        value: '7',
                                        color: colors.GREEN,
                                        children: [],
                                        horizontalSpan: 2,
                                        verticalSpan: 2,
                                    }, {
                                        value: '8',
                                        color: colors.ORANGE,
                                        verticalSpan: 2,
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    }, {
        name: 'Table 3 - like #2 but incorrect',
        children: [
            {
                value: '1',
                color: colors.BLUE,
                children: [],
                horizontalSpan: 2,
            }, {
                value: '2',
                color: colors.GREEN,
                children: [
                    {
                        value: '3',
                        color: colors.ORANGE,
                        children: [],
                        horizontalSpan: 2,
                        verticalSpan: 4,
                    }, {
                        value: '4',
                        color: colors.PURPLE,
                        children: [
                            {
                                value: '5',
                                color: colors.RED,
                                children: [],
                                horizontalSpan: 2,
                            }, {
                                value: '6',
                                color: colors.BLUE,
                                children: [
                                    {
                                        value: '7',
                                        color: colors.GREEN,
                                        children: [],
                                        horizontalSpan: 2,
                                    }, {
                                        value: '8',
                                        color: colors.ORANGE,
                                        verticalSpan: 2,
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
