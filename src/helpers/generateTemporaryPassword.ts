import generatePassword from 'generate-password';

export const generateTemporaryPassword = (): string => {
    return generatePassword.generate({ length: 8, numbers: true });
};
