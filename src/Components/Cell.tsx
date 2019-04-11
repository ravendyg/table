import * as React from 'react';
import { ICell } from '../Models';

interface IProps {
    id: string;
    cell: ICell;
}

interface IState { }

export class Cell extends React.PureComponent<IProps, IState> {
    renderChild = (cell: ICell, index: number) => {
        const id = `${this.props.id}.${index};`

        return <Cell
            key={id}
            id={id}
            cell={cell}
        />
    }

    renderChildren = (cells: ICell[]) => {
        if (cells.length === 0) {
            return null;
        }

        return <div className='cell--children'>
            {cells.map(this.renderChild)}
        </div>
    }

    render() {
        const {
            cell: {
                value,
                color,
                verticalSpan,
                children,
            },
        } = this.props;
        const cellStyle = {
            backgroundColor: color,
        };
        const contentStyle = {
            flexGrow: verticalSpan,
        };
        const className = 'cell'
            + (children.length === 0 ? ' cell--children--no_children' : '');

        return <div className={className} style={cellStyle}>
            <div className='cell--content' style={contentStyle}>{value}</div>
            {this.renderChildren(children)}
        </div>;
    }
}
