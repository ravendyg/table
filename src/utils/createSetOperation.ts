import { ITable, ICell, colors } from '../Models';

// update operations are identical excluding validation
export function createSetOperation(key: string, ids: number[], payload: string | number) {
    let operation = {};
    let nested: any = operation;
    ids.slice(0, ids.length - 1).forEach(id => {
        const children = {};
        nested[id] = { children };
        nested = children;
    });
    nested[ids[ids.length - 1]] = {
        [key]: {
            $set: payload,
        },
    };

    return operation;
}

export function calculateInsertionDepth(tables: ITable[], ids: number[]) {
    let nested: any = {};
    let targeted: any = tables;
    // -1 to compensate for the table itself
    let depth = -1;
    ids.forEach(id => {
        depth += targeted[id].verticalSpan || 1;
        targeted = targeted[id].children;
        const children = {};
        nested[id] = { children };
        nested = children;
    });

    return depth;
}

export function addInsertChildrenOrStretchOperation(
    tabls: ITable[],
    container: ICell,
    ids: number[],
    depth: number,
    targetDepth: number,
    operations: any[],
) {
    // stretched over target line
    if ((container.verticalSpan || 1) + depth > targetDepth) {
        const operation = createSetOperation('verticalSpan', ids, (container.verticalSpan || 1) + 1);
        operations.push(operation);
    }
    // reached bottom
    else if (container.children.length === 0
        || (container.verticalSpan || 1) + depth === targetDepth
    ) {
        const operation: any = {};
        let nested: any = operation;
        let targeted: any = tabls;
        ids.slice(0, ids.length - 1).forEach(id => {
            targeted = targeted[id].children;
            const children = {};
            nested[id] = { children };
            nested = children;
        });
        targeted = targeted[ids[ids.length - 1]];
        const newChildren: ICell[] = [{
            children: targeted.children,
            color: colors.BLUE,
            value: '-1',
        }];
        if (targeted.horizontalSpan) {
            newChildren[0].horizontalSpan = targeted.horizontalSpan;
        }
        nested[ids[ids.length - 1]] = {
            children: {
                $set: newChildren,
            },
        };

        operations.push(operation);
    }
    // intermediate
    else {
        container.children.forEach((cell, index) => {
            addInsertChildrenOrStretchOperation(
                tabls,
                cell,
                ids.concat(index),
                depth + (container.verticalSpan || 1),
                targetDepth,
                operations,
            );
        });
    }
}
