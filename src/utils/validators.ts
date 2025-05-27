export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
    // Mínimo 8 caracteres, al menos una letra mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return passwordRegex.test(password);
};

export const validateUsername = (username: string): boolean => {
    // Mínimo 4 caracteres, solo letras, números y guiones bajos
    const usernameRegex = /^[a-zA-Z0-9_]{4,}$/;
    return usernameRegex.test(username);
};

export const validateCurrencyCode = (code: string): boolean => {
    // Código de moneda ISO 4217 (3 letras mayúsculas)
    const currencyRegex = /^[A-Z]{3}$/;
    return currencyRegex.test(code);
};

export const validateAmount = (amount: number): boolean => {
    return amount > 0 && amount <= 999999999.99;
};

export const validateCommission = (commission: number): boolean => {
    return commission >= 0 && commission <= 100;
};

export const validateOperatorCode = (code: string): boolean => {
    // Mínimo 3 caracteres, solo letras, números y guiones
    const operatorRegex = /^[a-zA-Z0-9-]{3,}$/;
    return operatorRegex.test(code);
};

export const validateGameCode = (code: string): boolean => {
    // Mínimo 3 caracteres, solo letras, números y guiones
    const gameRegex = /^[a-zA-Z0-9-]{3,}$/;
    return gameRegex.test(code);
};

export const validateProviderCode = (code: string): boolean => {
    // Mínimo 3 caracteres, solo letras, números y guiones
    const providerRegex = /^[a-zA-Z0-9-]{3,}$/;
    return providerRegex.test(code);
};

export const validateApiKey = (key: string): boolean => {
    // Mínimo 32 caracteres, solo letras, números y guiones
    const apiKeyRegex = /^[a-zA-Z0-9-]{32,}$/;
    return apiKeyRegex.test(key);
};

export const validateApiSecret = (secret: string): boolean => {
    // Mínimo 32 caracteres, solo letras, números y guiones
    const apiSecretRegex = /^[a-zA-Z0-9-]{32,}$/;
    return apiSecretRegex.test(secret);
}; 