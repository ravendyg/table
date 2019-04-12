import * as React from 'react';
import { ICell } from '../Models';

const GRID_UNIT = 100;

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
                verticalSpan = 1,
                horizontalSpan = 1,
                children,
            },
        } = this.props;
        let cellStyle: any = {
            backgroundColor: color,
        };
        // width is completely a product of combined width of all children
        if (children.length === 0) {
            // allow 1 px for the border
            cellStyle.width = `${horizontalSpan * GRID_UNIT - 1}px`;
        }
        const contentStyle = {
            height: `${verticalSpan * GRID_UNIT - 1}px`,
        };
        const className = 'cell';

        return <div className={className} style={cellStyle}>
            <div className='cell--content' style={contentStyle}>
                {`${value} - ${horizontalSpan} - ${verticalSpan}`}
            </div>
            {this.renderChildren(children)}
        </div>;
    }
}
