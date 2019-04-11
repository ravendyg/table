import React, { Component } from 'react';
import './App.css';
import { Cell } from './Components/Cell';
import { ICell, EColor } from './Models';

const data: ICell = {
    color: EColor.ORANGE,
    value: '1',
    children: [
        {
            color: EColor.GREEN,
            value: '4',
            children: [{
                color: EColor.PURPLE,
                value: '7',
                children: [],
            }],
        }, {
            color: EColor.GREEN,
            value: '5',
            children: [{
                color: EColor.PURPLE,
                value: '8',
                children: [],
            }],
        }
    ],
}

class App extends Component {
    render() {
        return (
            <div className="App">
                <Cell cell={data} id='0' />
            </div>
        );
    }
}

export default App;
