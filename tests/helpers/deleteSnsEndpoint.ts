import AWS from 'aws-sdk';
import * as Sentry from '@sentry/node';
import { getServiceConfig } from '../../src/getServiceConfig';

const credentials = new AWS.Credentials({
    accessKeyId: getServiceConfig().AWS_ACCESS_KEY_ID,
    secretAccessKey: getServiceConfig().AWS_SECRET_ACCESS_KEY,
});
AWS.config.update({ credentials, region: getServiceConfig().AWS_REGION });
export const SNS = new AWS.SNS({});

export const deleteSnsEndpoint = async ({ endpointArn }: { endpointArn: string }): Promise<void> => {
    try {
        await SNS.deleteEndpoint({ EndpointArn: endpointArn }).promise();
    } catch (err) {
        if (getServiceConfig().NODE_ENV !== 'test') {
            Sentry.captureException(err);
        }
    }
};

export const getSnsEndpoint = async ({
    endpointArn,
}: {
    endpointArn: string;
}): Promise<AWS.SNS.MapStringToString | undefined> => {
    try {
        const { Attributes } = await SNS.getEndpointAttributes({ EndpointArn: endpointArn }).promise();
        return Attributes;
    } catch (err) {
        if (getServiceConfig().NODE_ENV !== 'test') {
            Sentry.captureException(err);
        }
    }
};
