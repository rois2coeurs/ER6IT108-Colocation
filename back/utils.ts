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
    return /^\+?[0-9]{7,15}$/.test(phone_number);
}

function checkPassword(password: string) {
    if (password.length < 8) return false;
    return !(!password.match(/[A-Z]/) && !password.match(/[0-9]/));
}

const useCors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

class CorsResponse extends Response {
    constructor(body: BodyInit | null = null, init?: ResponseInit) {
        super(body, {...init, headers: {...useCors, ...init?.headers}});
    }
    static json(body: BodyInit | null = null, init?: ResponseInit) {
        return new CorsResponse(JSON.stringify(body), {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...useCors,
                ...init?.headers
            }
        });
    }
}

export {setBounds, castToNumber, checkPhoneNumber, checkPassword, CorsResponse};