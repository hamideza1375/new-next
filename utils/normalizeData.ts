interface Normalizable {
    _id: string | number;
    [key: string]: any;
}

export const normalizeData = <T extends Normalizable>(array: T[] = [],dt: T | null,id?: string | number): T[] => {
    // Create dictionary by _id
    const dictionary = array.reduce<Record<string | number, T>>((acc, curr) => {
        if (curr._id !== undefined) {
            acc[curr._id] = curr;
        }
        return acc;
    }, {});

    // Handle updates/deletions
    if (id !== undefined) {
        if (dt === null) {
            // Delete item if exists
            if (dictionary.hasOwnProperty(id)) {
                delete dictionary[id];
            }
        } else {
            // Update or add item
            dictionary[id] = dt;
        }
    }

    // Return as array
    return Object.values(dictionary);
};
