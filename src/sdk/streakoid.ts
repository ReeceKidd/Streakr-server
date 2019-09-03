import completeTasks from "./completeTasks";
import soloStreaks from "./soloStreaks";
import stripe from "./stripe";
import users from "./users";
import friends from "./friends";
import groupStreaks from "./groupStreaks";
import streakTrackingEvents from "./streakTrackingEvents";

export default {
  completeTasks,
  soloStreaks,
  stripe,
  users: {
    ...users,
    friends
  },
  groupStreaks,
  streakTrackingEvents
};
