import ApiVersions from './ApiVersions';
import RouterCategories from '@streakoid/streakoid-models/lib/Types/RouterCategories';
import { Note } from '@streakoid/streakoid-models/lib/Models/Note';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { GetRequest, PostRequest, DeleteRequest } from './request';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const notes = ({
    getRequest,
    postRequest,
    deleteRequest,
}: {
    getRequest: GetRequest;
    postRequest: PostRequest;
    deleteRequest: DeleteRequest;
}) => {
    const getAll = async ({ userId, subjectId }: { userId?: string; subjectId?: string }): Promise<Note[]> => {
        try {
            let getAllNotesURL = `/${ApiVersions.v1}/${RouterCategories.notes}?`;

            if (userId) {
                getAllNotesURL = `${getAllNotesURL}userId=${userId}&`;
            }

            if (subjectId) {
                getAllNotesURL = `${getAllNotesURL}subjectId=${subjectId}&`;
            }

            return getRequest({ route: getAllNotesURL });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const getOne = async (noteId: string): Promise<Note> => {
        try {
            return getRequest({ route: `/${ApiVersions.v1}/${RouterCategories.notes}/${noteId}` });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    const create = async ({
        userId,
        subjectId,
        text,
        streakType,
    }: {
        userId: string;
        subjectId: string;
        text: string;
        streakType: StreakTypes;
    }): Promise<Note> => {
        try {
            return postRequest({
                route: `/${ApiVersions.v1}/${RouterCategories.notes}`,
                params: {
                    userId,
                    subjectId,
                    text,
                    streakType,
                },
            });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const deleteOne = ({ noteId }: { noteId: string }): Promise<any> => {
        try {
            return deleteRequest({ route: `/${ApiVersions.v1}/${RouterCategories.notes}/${noteId}` });
        } catch (err) {
            return Promise.reject(err);
        }
    };

    return {
        getAll,
        getOne,
        create,
        deleteOne,
    };
};

export { notes };
