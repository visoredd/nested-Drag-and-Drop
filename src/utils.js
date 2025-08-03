export function findItem(tree, id) {
    for (let node of tree) {
        if (node.id === id) return node;
        if (node.children) {
            const found = findItem(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

export function removeItem(tree, id) {
    return tree
        .map((node) => {
            if (node.id === id) return null;
            if (node.children) {
                node.children = removeItem(node.children, id);
            }
            return node;
        })
        .filter(Boolean);
}

export function insertItem(tree, parentId, newItem) {
    return tree.map((node) => {
        if (node.id === parentId) {
            return {
                ...node,
                children: [...(node.children || []), newItem],
            };
        }
        if (node.children) {
            return {
                ...node,
                children: insertItem(node.children, parentId, newItem),
            };
        }
        return node;
    });
}

export function isDescendant(node, targetId) {
    if (!node?.children?.length) return false;
    for (let child of node.children) {
        if (child.id === targetId || isDescendant(child, targetId)) return true;
    }
    return false;
}
