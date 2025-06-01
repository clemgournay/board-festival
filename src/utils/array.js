export const FindIndexByPropValue = (items, prop, value) => {
    let i = 0, found = false;
    while (!found && i < items.length) {
        if (items[i][prop] == value) found = true;
        else i++;
    }
    return (found) ? i : -1;
}

export const FindItemByPropValue = (items, prop, value) => {
    const index = FindIndexByPropValue(items, prop, value);
    return (index >= 0) ? items[index] : null;
}