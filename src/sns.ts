import AWS from 'aws-sdk';
import { getServiceConfig } from './getServiceConfig';
const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = getServiceConfig();
const credentials = new AWS.Credentials({ accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_SECRET_ACCESS_KEY });
AWS.config.update({ credentials, region: AWS_REGION });
export const SNS = new AWS.SNS({});
