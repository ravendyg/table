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
import { tables } from './testData';
import { createSetOperation } from './utils/createSetOperation';

interface IProps { }

interface IState {
    menuTop: number | null;
    menuLeft: number | null;
    menuId: string | null;
    tables: ITable[];
    // since we are using immutable data structures
    // we can hope that `react-addons-update` reuses most of the objects
    // and there wion't be huge memory usage impact
    previous: ITable[][];
    reverted: ITable[][];
}

class App extends React.PureComponent<IProps, IState> {
    constructor(props: IProps) {
        super(props);

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

    applyTrx = (type: ETrxType, target: string, payload?: string | number) => {
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

        this.setState({
            previous,
            reverted: [],
            tables,
        });
    };

    undo = () => {
        const [tables, ...previous] = this.state.previous;
        const reverted = [this.state.tables, ...this.state.reverted];
        this.setState({
            tables,
            previous,
            reverted,
        });
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
