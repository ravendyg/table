import React from 'react';
import update from 'react-addons-update';
import './App.css';
import {
    colors,
    ITable,
    ITrx,
    ETrxType,
    ICell,
} from './Models';
import { Table } from './Components/Table';
import { ContextMenu } from './Components/ContextMenu';

const tables: ITable[] = [
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
        name: 'Table 3 - like #2 but icorrect',
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

interface IProps { }

interface IState {
    menuTop: number | null;
    menuLeft: number | null;
    menuId: string | null;
    tables: ITable[];
    applied: ITrx[];
    reverted: ITrx[];
}

class App extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            menuTop: null,
            menuLeft: null,
            menuId: null,
            tables,
            applied: [],
            reverted: [],
        };
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.hideContextMenu);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.hideContextMenu);
    }

    showContextMenu = (menuLeft: number, menuTop: number, menuId: string) => {
        this.setState({
            menuLeft,
            menuTop,
            menuId,
        });
    };

    hide = () => {
        this.setState({
            menuLeft: null,
            menuTop: null,
            menuId: null,
        });
    };

    hideContextMenu = (e: Event) => {
        // a hack to avoid handling react and window listeners order
        const target: HTMLDivElement | null = e.target as any;
        if (target && target.className === 'menu--action') {
            setTimeout(this.hide);
        } else {
            this.hide();
        }
    }

    applyTrx = (type: ETrxType, target: string) => {
        const trx: ITrx = {
            target,
            type,
        };
        const applied = [trx, ...this.state.applied];
        const ids = target.split('.').map(id => +id);

        let operation: any;
        // TODO: add comments explaining this mess
        switch (type) {
            case ETrxType.INSERT_ABOVE: {
                operation = {};
                let nested: any = operation;
                let targeted: any = this.state.tables;
                ids.slice(0, ids.length - 1).forEach(id => {
                    targeted = targeted[id].children;
                    const children = {};
                    nested[id] = { children };
                    nested = children;
                });
                targeted = targeted[ids[ids.length - 1]];
                const newCell: ICell = {
                    children: [targeted],
                    color: colors.BLUE,
                    value: '-1',
                };
                nested[ids[ids.length - 1]] = { '$set': newCell };
                break;
            }

            case ETrxType.INSERT_BELOW: {
                operation = {};
                let nested: any = operation;
                let targeted: any = this.state.tables;
                ids.slice(0, ids.length - 1).forEach(id => {
                    targeted = targeted[id].children;
                    const children = {};
                    nested[id] = { children };
                    nested = children;
                });
                targeted = targeted[ids[ids.length - 1]];
                const newChildren: ICell[] = [{
                    children: targeted.children,
                    color: colors.BLUE,
                    value: '-1',
                }];
                nested[ids[ids.length - 1]] = {
                    children: {
                        $set: newChildren,
                    },
                };
                break;
            }

            case ETrxType.INSERT_LEFT: {
                operation = {};
                let nested: any = operation;
                ids.slice(0, ids.length - 1).forEach(id => {
                    const children = {};
                    nested[id] = { children };
                    nested = children;
                });
                const newCell: ICell = {
                    children: [],
                    color: colors.BLUE,
                    value: '-1',
                };
                nested['$splice'] = [[ids[ids.length - 1], 0, newCell]];
                break;
            }

            case ETrxType.INSERT_RIGHT: {
                operation = {};
                let nested: any = operation;
                ids.slice(0, ids.length - 1).forEach(id => {
                    const children = {};
                    nested[id] = { children };
                    nested = children;
                });
                const newCell: ICell = {
                    children: [],
                    color: colors.BLUE,
                    value: '-1',
                };
                nested['$splice'] = [[ids[ids.length - 1] + 1, 0, newCell]];
                break;
            }

            default: {
                // don't know how to handle - do nothing
                return;
            }
        }


        const tables: ITable[] = update(
            this.state.tables,
            operation,
        );
        // console.log(
        //     // this.state.tables,
        //     tables,
        // );
        // console.log(operation);

        this.setState({
            applied,
            tables,
        });
    };

    undo = () => {
        const [trx, ...applied] = this.state.applied;
        const reverted = [trx, ...this.state.reverted];
        console.log('undo:', trx);
        this.setState({
            applied,
            reverted,
        });
    };

    redo = () => {
        const [trx, ...reverted] = this.state.reverted;
        const applied = [trx, ...this.state.applied];
        console.log('redo:', trx);
        this.setState({
            applied,
            reverted,
        });
    };

    render() {
        const {
            menuLeft,
            menuTop,
            menuId,
            applied,
            reverted,
        } = this.state;

        return (
            <div className="App">
                <div>
                    <button
                        onClick={this.undo}
                        disabled={applied.length === 0}
                    >Undo</button>
                    <button
                        onClick={this.redo}
                        disabled={reverted.length === 0}
                    >Redo</button>
                </div>
                {this.state.tables.map((table, index) => (
                    <Table
                        key={table.name}
                        table={table}
                        id={`${index}`}
                        onContext={this.showContextMenu}
                    />
                ))}
                <ContextMenu
                    left={menuLeft}
                    top={menuTop}
                    id={menuId}
                    applyTrx={this.applyTrx}
                />
            </div>
        );
    }
}

export default App;
