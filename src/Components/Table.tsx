import * as React from 'react';
import { ICell, ITable } from '../Models';
import { Cell } from './Cell';

interface IProps {
    id: string;
    table: ITable;
    onContext: (menuLeft: number, menuTop: number, id: string) => void;
}

interface IState {}

export class Table extends React.PureComponent<IProps, IState> {
    renderCell = (cell: ICell, index: number) => {
        const tableId = this.props.id;
        const id = `${tableId}.${index}`;
        return <Cell
            key={id}
            cell={cell}
            id={id}
            onContext={this.props.onContext}
        />;
    }

    render() {
        const {
            name,
            children,
        } = this.props.table;

        return <div className='table'>
            <div className='table--header'>
                {name}
            </div>
            <div className='table--body'>
                {children.map(this.renderCell)}
            </div>
        </div>
    }
}
