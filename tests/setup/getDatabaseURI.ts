import { getServiceConfig } from '../../src/getServiceConfig';
const { DATABASE_URI } = getServiceConfig();

export const getDatabaseURI = ({ testName }: { testName: string }): string => `${DATABASE_URI}-${testName}`;
