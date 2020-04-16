## Deployed
http://table.nskgortrans.info/

## Requirements
* NodeJS 10+
* NPM 6+

Tested on 10.15.3 and 6.4.1

### Installation
`npm i`

### Dev run
`npm run dev`

### Build
`npm run build`


## How does it work
There are 3 tables with different structure. All can be modified (insert/delete cells, change cell color, text, span). Just right click any cell.

Grid size is 100px. This means that minimum cell size is 100 * 100 px. A cell with vertical span 3 would have size 100 * 300 px.

If a cell has children its horizontal span ignored and width is equal to total children width. Making cell have it's own width not equal to those of the children is possible, but would require way more code and does not look logical for me.

Color input is not validated, but assumed to be anything acceptable by CSS.

Current state is persisted to the disk and will be restore after tab refresh. If you need to get back to the initial state there is a `refresh` button.

All changes (during the current session) can be undone and replayed. But history is not stored on the disk.
That is because during serialization/deserialization all links would be lost and all benefits provided by `react-addons-update` data structures lost. The problem could be fixed by storing each cell as a separate object and replacing children links with hashes - kind of Merkle tree. But the solution probably would take about the same amount on itself.

If a cell vertical span does not match the size of it's neighbours the rest of the space below it would be painted with the color of it's parent (or the table itself - #cfcfcf). See table 3, which is the same as table 2 but with some cells having incorrect vertical span.

## What to improve
* Take out the tree modification algorithm. Now it is just harcoded into the test page. But before I know that it works as expected or how it would be reused, there is no reason for that.
* Add table/cell insertion with a parser.
* Implement copy/paste.
