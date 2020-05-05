import { activityFeedItemModel } from '../../src/Models/ActivityFeedItem';
import { MongooseDocument } from 'mongoose';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';

export const createActivityFeedItem = (activityFeedItem: ActivityFeedItemType): Promise<MongooseDocument> => {
    const newActivityFeedItem = new activityFeedItemModel(activityFeedItem);
    return newActivityFeedItem.save();
};
