import * as React from 'react';
import { ICell, ITable } from '../Models';
import { Cell } from './Cell';

interface IProps {
    table: ITable;
}

interface IState {}

export class Table extends React.PureComponent<IProps, IState> {
    renderCell = (cell: ICell, id: number) => {
        return <Cell
            key={`${id}`}
            cell={cell}
            id={`${id}`}
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
