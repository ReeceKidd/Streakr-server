import { AxiosInstance } from 'axios';
import { GetRequest, PostRequest, DeleteRequest, PatchRequest } from './request';
import { StreakoidSDK, streakoidSDKFactory } from './streakoidSDKFactory';

export const streakoidAxiosSDKFactory = (streakoidClient: AxiosInstance): StreakoidSDK => {
    const getRequest: GetRequest = ({ route }) => streakoidClient.get(route);
    const getRequestActivityFeed: GetRequest = ({ route }) => streakoidClient.get(route);
    const postRequest: PostRequest = ({ route, params }) => streakoidClient.post(route, params);
    const patchRequest: PatchRequest = ({ route, params }) => {
        if (params) {
            return streakoidClient.patch(route, params);
        }
        return streakoidClient.patch(route);
    };
    const deleteRequest: DeleteRequest = ({ route }) => streakoidClient.delete(route);
    return streakoidSDKFactory({ getRequest, getRequestActivityFeed, postRequest, patchRequest, deleteRequest });
};
