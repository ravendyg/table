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
import { createSetOperation } from './utils/createSetOperation';

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

        let operation: any;

        switch (type) {
            // find children containing selected cell, replace with an array
            // containing only one new cell and give to the new cell replaced children
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

            // get children of the selected cell, replace with an array containing only one new cell
            // add assign this new cell children of the parent
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
                if (targeted.horizontalSpan) {
                    newChildren[0].horizontalSpan = targeted.horizontalSpan;
                }
                nested[ids[ids.length - 1]] = {
                    children: {
                        $set: newChildren,
                    },
                };
                break;
            }

            // get children containing selected cell, splice before
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

            // get children containing selected cell, splice after
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


        const tables: ITable[] = update(
            this.state.tables,
            operation,
        );
        const previous = [this.state.tables, ...this.state.previous];

        this.updateTablesAndHistory(tables, previous, [])
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
