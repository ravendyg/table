import * as React from 'react';

interface IProps {
    top: number | null;
    left: number | null;
    id: string | null;
}

interface IState {}

export class ContextMenu extends React.PureComponent<IProps, IState> {
    insertAbove = () => {
        console.log(`insert above: ${this.props.id}`);
    }

    insertBelow = () => {
        console.log(`insert below: ${this.props.id}`);
    }

    insertToTheLeft = () => {
        console.log(`insert to the left: ${this.props.id}`);
    }

    insertToTheRight = () => {
        console.log(`insert to the right: ${this.props.id}`);
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
