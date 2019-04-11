import React from 'react';
import './App.css';
import { colors, ITable } from './Models';
import { Table } from './Components/Table';

const tables: ITable[] = [
    {
        name: 'Table 1',
        children: [
            {
                color: colors.ORANGE,
                value: '1',
                children: [
                    {
                        color: colors.GREEN,
                        value: '4',
                        children: [{
                            color: colors.PURPLE,
                            value: '7',
                            children: [],
                        }],
                    }, {
                        color: colors.GREEN,
                        value: '5',
                        children: [{
                            color: colors.PURPLE,
                            value: '8',
                            children: [],
                        }],
                    }
                ],
            }, {
                color: colors.ORANGE,
                value: '2',
                children: [
                    {
                        color: colors.GREEN,
                        value: '6',
                        verticalSpan: 2,
                        children: [],
                    }
                ],
            }, {
                color: colors.ORANGE,
                value: '3',
                verticalSpan: 2,
                children: [
                    {
                        color: colors.PURPLE,
                        value: '9',
                        horizontalSpan: 2,
                        children: [],
                    }, {
                        color: colors.PURPLE,
                        value: '10',
                        children: [],
                    },
                ],
            },
        ],
    },
]

class App extends React.PureComponent {
    render() {
        return (
            <div className="App">
                {tables.map(table => (
                    <Table
                        key={table.name}
                        table={table}
                    />
                ))}
            </div>
        );
    }
}

export default App;
