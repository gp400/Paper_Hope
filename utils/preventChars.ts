export const preventChars = (e: React.KeyboardEvent<HTMLInputElement>, invalidKeys: string[]) => {
    const key = e.key;
    if (invalidKeys.includes(key)) {
        e.preventDefault();
    }
}