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

function checkPhoneNumber(phone_number: string) {
    return phone_number.match(/\+?[0-9]{7,15}/);
}

function checkPassword(password: string) {
    if (password.length < 8) return false;
    return !(!password.match(/[A-Z]/) && !password.match(/[0-9]/));
}

export {setBounds, castToNumber, checkPhoneNumber, checkPassword};