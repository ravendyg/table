import * as React from 'react';
import { ICell } from '../Models';

interface IProps {
    id: string;
    cell: ICell;
}

interface IState { }

export class Cell extends React.PureComponent<IProps, IState> {
    renderChildren = (cell: ICell, index: number) => {
        const id = `${this.props.id}.${index};`

        return <Cell
            key={id}
            id={id}
            cell={cell}
        />
    }

    render() {
        const {
            cell,
            cell: {
                value,
            },
        } = this.props;

        return <React.Fragment>
            <div>{value}</div>
            {cell.children.map(this.renderChildren)}
        </React.Fragment>;
    }
}
