import * as React from 'react';
import { ETrxType } from '../Models';

interface IProps {
    top: number | null;
    left: number | null;
    id: string | null;
    applyTrx: (type: ETrxType, target: string) => void;
}

interface IState { }

export class ContextMenu extends React.PureComponent<IProps, IState> {
    apply = (type: ETrxType) => {
        const {
            id,
            applyTrx,
        } = this.props;
        if (id) {
            applyTrx(type, id);
        }
    };

    insertAbove = () => this.apply(ETrxType.INSERT_ABOVE);

    insertBelow = () => this.apply(ETrxType.INSERT_BELOW);

    insertToTheLeft = () => this.apply(ETrxType.INSERT_LEFT);

    insertToTheRight = () => this.apply(ETrxType.INSERT_RIGHT);

    render() {
        const {
            top,
            left,
            id,
        } = this.props;

        if (left === null || top === null || id === null) {
            return null;
        }

        // don't handle click position, always open to the rigth and bottom
        const style = {
            top: `${top - 25}px`,
            left: `${left - 25}px`,
        };

        return <div className='menu' style={style}>
            <ul className='menu--list'>
                <li
                    className='menu--action'
                    onMouseDown={this.insertAbove}
                >Insert above</li>
                <li
                    className='menu--action'
                    onMouseDown={this.insertBelow}
                >Insert below</li>
                <li
                    className='menu--action'
                    onMouseDown={this.insertToTheLeft}
                >Insert to the left</li>
                <li
                    className='menu--action'
                    onMouseDown={this.insertToTheRight}
                >Insert to the right</li>
            </ul>
        </div>;
    }
}
