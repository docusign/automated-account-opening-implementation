/**
 * Utility class to filter and rehydrate a single search result.
 */
export class ResultRehydrator {
    /**
     * Assigns a value to an object at a specific path.
     * Removes any type suffix (e.g., (:typeName)) from keys.
     * @param obj - The object to assign the value to.
     * @param path - The path where the value should be assigned.
     * @param value - The value to assign.
     */
    private static assignValueByPath(obj: Record<string, any>, path: string, value: any): void {
        const segments: string[] = path.split('/');
        let currentObj: Record<string, any> = obj;

        for (let i = 0; i < segments.length; i++) {
            // Remove type suffix (e.g., (:typeName)) from segment
            const segment: string = segments[i].replace(/\(:.*?\)/, '').replace(/\[\]$/, ''); // Remove array indicator and type suffix

            if (i === segments.length - 1) {
                // Assign value at last segment
                currentObj[segment] = value;
            } else {
                // Create nested objects/arrays as needed
                if (!currentObj[segment]) {
                    currentObj[segment] = {};
                }
                currentObj = currentObj[segment];
            }
        }
    }
}

