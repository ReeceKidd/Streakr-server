import { activityFeedItemModel } from '../../src/Models/ActivityFeedItem';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib';
import { MongooseDocument } from 'mongoose';

export const createActivityFeedItem = (activityFeedItem: ActivityFeedItemType): Promise<MongooseDocument> => {
    const newActivityFeedItem = new activityFeedItemModel(activityFeedItem);
    return newActivityFeedItem.save();
};
