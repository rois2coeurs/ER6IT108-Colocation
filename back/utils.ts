function setBounds(value: number | null, min: number, max: number): number {
    if (value === null) return min;
    if (value < min) return min;
    if (value > max) return max;
    return value;
}

function castToNumber(value: string | null): number | null {
    if (value === null) return null;
    const numberValue = Number(value);
    return isNaN(numberValue) ? null : numberValue;
}

export {setBounds, castToNumber};