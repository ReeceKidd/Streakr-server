import { Router } from 'express';

import { createGroupMemberStreakMiddlewares } from '../../../RouteMiddlewares/GroupMemberStreak/createGroupMemberStreakMiddlewares';
import { deleteGroupMemberStreakMiddlewares } from '../../../RouteMiddlewares/GroupMemberStreak/deleteGroupMemberStreakMiddlewares';
import { getOneGroupMemberStreakMiddlewares } from '../../../RouteMiddlewares/GroupMemberStreak/getOneGroupMemberStreakMiddlewares';
import { getAllGroupMemberStreaksMiddlewares } from '../../../RouteMiddlewares/GroupMemberStreak/getAllGroupMemberStreaksMiddlewares';
import { patchGroupMemberStreakMiddlewares } from '../../../RouteMiddlewares/GroupMemberStreak/patchGroupMemberStreakMiddlewares';

export const groupMemberStreakId = 'groupMemberStreakId';

const groupMemberStreaksRouter = Router();

groupMemberStreaksRouter.get(`/`, ...getAllGroupMemberStreaksMiddlewares);

groupMemberStreaksRouter.get(`/:${groupMemberStreakId}`, ...getOneGroupMemberStreakMiddlewares);

groupMemberStreaksRouter.delete(`/:${groupMemberStreakId}`, ...deleteGroupMemberStreakMiddlewares);

groupMemberStreaksRouter.post(`/`, ...createGroupMemberStreakMiddlewares);

groupMemberStreaksRouter.patch(`/:${groupMemberStreakId}`, ...patchGroupMemberStreakMiddlewares);

export { groupMemberStreaksRouter };
