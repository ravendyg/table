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
