export const generateAlreadyExistsMessage = (subject: string, key: string, value: string) => {
    return `${subject} with ${key}: '${value}' already exists`
}