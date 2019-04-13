import * as React from 'react';
import { ETrxType, colors } from '../Models';

interface IProps {
    top: number | null;
    left: number | null;
    id: string | null;
    applyTrx: (type: ETrxType, target: string, payload?: string | number) => void;
}

interface IState { }

export class ContextMenu extends React.PureComponent<IProps, IState> {
    apply = (type: ETrxType, payload?: string | number) => {
        const {
            id,
            applyTrx,
        } = this.props;
        if (id) {
            applyTrx(type, id, payload);
        }
    };

    insertAbove = () => this.apply(ETrxType.INSERT_ABOVE);

    insertBelow = () => this.apply(ETrxType.INSERT_BELOW);

    insertToTheLeft = () => this.apply(ETrxType.INSERT_LEFT);

    insertToTheRight = () => this.apply(ETrxType.INSERT_RIGHT);

    setVerticalSpan = () => {
        const span = prompt('New vertical span (number)');
        const value = span ? +span : 1;
        if (span != '' + value) {
            alert('Incorrect value');
        } else {
            this.apply(ETrxType.SET_VERTICAL_SPAN, value);
        }
    }

    setHorizontalSpan = () => {
        const span = prompt('New horizontal span (number)');
        const value = span ? +span : 1;
        if (span != '' + value) {
            alert('Incorrect value');
        } else {
            this.apply(ETrxType.SET_HORIZONTAL_SPAN, value);
        }
    }

    setValue = () => {
        const text = prompt('New text');
        this.apply(ETrxType.SET_VALUE, text || '');
    }

    setColor = () => {
        const color = prompt('New color (any valid css color, not validated)');
        this.apply(ETrxType.SET_COLOR, color || colors.ORANGE);
    }

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
                <li className='menu--header'>Insert</li>
                <li
                    className='menu--action'
                    onMouseDown={this.insertAbove}
                >Above</li>
                <li
                    className='menu--action'
                    onMouseDown={this.insertBelow}
                >Below</li>
                <li
                    className='menu--action'
                    onMouseDown={this.insertToTheLeft}
                >To the left</li>
                <li
                    className='menu--action'
                    onMouseDown={this.insertToTheRight}
                >To the right</li>

                <li className='menu--header'>Change</li>
                <li
                    className='menu--action'
                    onMouseDown={this.setVerticalSpan}
                >Vertical span</li>
                <li
                    className='menu--action'
                    onMouseDown={this.setHorizontalSpan}
                >Horizontal span</li>
                <li
                    className='menu--action'
                    onMouseDown={this.setColor}
                >Color</li>
                <li
                    className='menu--action'
                    onMouseDown={this.setValue}
                >Value</li>
            </ul>
        </div>;
    }
}
