// import streakoid from "../../streakoid";
// import {
//     GroupMemberStreak,
//     CurrentStreak,
//     Activtiy,
//     PastStreakArray,
//     PastStreak
// } from "@streakoid/streakoid-sdk/lib";
// import StreakTrackingEventType from "@streakoid/streakoid-sdk/lib/streakTrackingEventType";

// export const resetIncompleteGroupMemberStreaks = async (
//     incompleteGroupMemberStreaks: GroupMemberStreak[],
//     endDate: string,
//     timezone: string
// ) => {
//     return Promise.all(
//         incompleteGroupMemberStreaks.map(async groupMemberStreak => {
//             const pastStreak: PastStreak = {
//                 endDate: endDate,
//                 startDate: groupMemberStreak.currentStreak.startDate || endDate,
//                 numberOfDaysInARow: groupMemberStreak.currentStreak.numberOfDaysInARow
//             };

//             const pastStreaks: PastStreakArray = [
//                 ...groupMemberStreak.pastStreaks,
//                 pastStreak
//             ];

//             const activity: Activtiy = {
//                 type: StreakTrackingEventType.LostStreak,
//                 time: endDate.toString()
//             };
//             const updatedActivity = [...groupMemberStreak.activity, activity];

//             const currentStreak: CurrentStreak = {
//                 startDate: "",
//                 numberOfDaysInARow: 0
//             };

//             await streakoid.groupMemberStreaks.update({
//                 groupMemberStreakId: groupMemberStreak._id,
//                 updateData: {
//                     currentStreak,
//                     pastStreaks,
//                     activity: updatedActivity,
//                     active: false
//                 }
//             });

//             return streakoid.streakTrackingEvents.create({
//                 type: StreakTrackingEventType.LostStreak,
//                 streakId: groupMemberStreak._id,
//                 userId: groupMemberStreak.userId
//             });
//         })
//     );
// };
