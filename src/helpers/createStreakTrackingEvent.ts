import { streakTrackingEventModel } from '../Models/StreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';

export const createStreakTrackingEvent = ({
    type,
    streakId,
    streakType,
    userId,
}: {
    type: StreakTrackingEventTypes;
    streakId: string;
    streakType: StreakTypes;
    userId?: string;
}): Promise<StreakTrackingEvent> => {
    const newStreakTrackingEvent = new streakTrackingEventModel({ type, streakId, userId, streakType });
    return newStreakTrackingEvent.save();
};
