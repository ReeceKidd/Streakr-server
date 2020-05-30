import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

export const generateRandomUsername = (): string =>
    uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });
