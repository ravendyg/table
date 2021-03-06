import React from 'react';
import update from 'react-addons-update';
import './App.css';
import {
    colors,
    ITable,
    ETrxType,
    ICell,
} from './Models';
import { Table } from './Components/Table';
import { ContextMenu } from './Components/ContextMenu';
import { defaultTables } from './testData';
import { createSetOperation, calculateInsertionDepth, addInsertChildrenOrStretchOperation, calculateTableDepth } from './utils/createSetOperation';

interface IProps { }

interface IState {
    menuTop: number | null;
    menuLeft: number | null;
    menuId: string | null;
    tables: ITable[];
    // since we are using immutable data structures
    // we can hope that `react-addons-update` reuses most of the objects
    // and there won't be huge memory usage problem
    previous: ITable[][];
    reverted: ITable[][];
}

class App extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        let tables: ITable[];
        try {
            tables = JSON.parse(localStorage.getItem('tables') || '');
        } catch {
            tables = defaultTables;
        }

        this.state = {
            menuTop: null,
            menuLeft: null,
            menuId: null,
            tables,
            previous: [],
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

    updateTablesAndHistory = (tables: ITable[], previous: ITable[][], reverted: ITable[][]) => {
        this.setState({ tables, previous, reverted });
        localStorage.setItem('tables', JSON.stringify(tables));
    }

    applyTrx = (type: ETrxType, target: string, payload?: string | number) => {
        const ids = target.split('.').map(id => +id);
        const { tables } = this.state;
        let operation: any;

        switch (type) {
            // calculate target depth and insert cells at this depth
            // or stretch overlapping cells
            case ETrxType.INSERT_ABOVE: {
                operation = [];
                const tableId = ids[0];
                const parentIds = ids.slice(0, ids.length - 1);
                let targetDepth = calculateInsertionDepth(tables, parentIds);
                if (targetDepth === 0) {
                    operation = [{
                        [tableId]: {
                            children: {
                                $set: [{
                                    children: tables[tableId].children,
                                    color: colors.BLUE,
                                    value: -1,
                                }],
                            },
                        },
                    }];
                } else {
                    tables[tableId].children.forEach((cell, index) => {
                        addInsertChildrenOrStretchOperation(
                            tables,
                            cell,
                            [tableId, index],
                            0,
                            targetDepth,
                            operation,
                        );
                    });
                }
                break;
            }

            // calculate target depth and insert cells at this depth
            // or stretch overlapping cells
            case ETrxType.INSERT_BELOW: {
                operation = [];
                const tableId = ids[0];
                let targetDepth = calculateInsertionDepth(tables, ids);
                tables[tableId].children.forEach((cell, index) => {
                    addInsertChildrenOrStretchOperation(
                        tables,
                        cell,
                        [tableId, index],
                        0,
                        targetDepth,
                        operation,
                    );
                });
                break;
            }

            // get children containing selected cell, splice before
            case ETrxType.INSERT_LEFT: {
                operation = {};
                let nested: any = operation;
                const parentIds = ids.slice(0, ids.length - 1);
                let targetDepth = calculateInsertionDepth(tables, parentIds);
                let tableDepth = calculateTableDepth(tables[ids[0]]);
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
                let nestedCount = tableDepth - targetDepth - 1;
                let children = newCell.children;
                while (nestedCount > 0) {
                    children[0] = {
                        children: [],
                        color: colors.BLUE,
                        value: '-1',
                    };
                    children = children[0].children;
                    nestedCount--;
                }
                nested['$splice'] = [[ids[ids.length - 1], 0, newCell]];
                break;
            }

            // get children containing selected cell, splice after
            case ETrxType.INSERT_RIGHT: {
                operation = {};
                let nested: any = operation;
                const parentIds = ids.slice(0, ids.length - 1);
                let targetDepth = calculateInsertionDepth(tables, parentIds);
                let tableDepth = calculateTableDepth(tables[ids[0]]);
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
                let nestedCount = tableDepth - targetDepth - 1;
                let children = newCell.children;
                while (nestedCount > 0) {
                    children[0] = {
                        children: [],
                        color: colors.BLUE,
                        value: '-1',
                    };
                    children = children[0].children;
                    nestedCount--;
                }
                nested['$splice'] = [[ids[ids.length - 1] + 1, 0, newCell]];
                break;
            }

            // find children containing this cell and splice it
            case ETrxType.DELETE_CELL: {
                operation = {};
                let nested: any = operation;
                ids.slice(0, ids.length - 1).forEach(id => {
                    const children = {};
                    nested[id] = { children };
                    nested = children;
                });

                nested['$splice'] = [[ids[ids.length - 1], 1]];
                break;
            }

            case ETrxType.SET_VERTICAL_SPAN: {
                operation = createSetOperation('verticalSpan', ids, payload || 1)
                break;
            }

            case ETrxType.SET_HORIZONTAL_SPAN: {
                operation = createSetOperation('horizontalSpan', ids, payload || 1)
                break;
            }

            case ETrxType.SET_COLOR: {
                operation = createSetOperation('color', ids, payload || colors.ORANGE)
                break;
            }

            case ETrxType.SET_VALUE: {
                operation = createSetOperation('value', ids, payload || '')
                break;
            }

            default: {
                // don't know how to handle - do nothing
                return;
            }
        }

        let _tables = this.state.tables
        if (Array.isArray(operation)) {
            operation.forEach(op => {
                _tables = update(_tables, op);
            })
        } else {
            _tables = update(_tables, operation);
        }
        const previous = [this.state.tables, ...this.state.previous];

        this.updateTablesAndHistory(_tables, previous, [])
    };

    undo = () => {
        const [tables, ...previous] = this.state.previous;
        const reverted = [this.state.tables, ...this.state.reverted];
        this.updateTablesAndHistory(tables, previous, reverted);
    };

    redo = () => {
        const [tables, ...reverted] = this.state.reverted;
        const previous = [this.state.tables, ...this.state.previous];
        this.setState({
            previous,
            reverted,
            tables,
        });
    };

    reset = () => {
        this.updateTablesAndHistory(defaultTables, [], []);
    }

    render() {
        const {
            menuLeft,
            menuTop,
            menuId,
            previous,
            reverted,
        } = this.state;

        return (
            <div className="App">
                <div>
                    <button
                        onClick={this.reset}
                        style={{ marginRight: '20px'}}
                        title='Cannot be undone'
                    >Reset</button>
                    <button
                        onClick={this.undo}
                        disabled={previous.length === 0}
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
