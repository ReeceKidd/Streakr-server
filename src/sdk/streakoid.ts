import completeTasks from "./completeTasks";
import soloStreaks from "./soloStreaks";
import stripe from "./stripe";
import users from "./users";
import friends from "./friends";

export default {
  completeTasks,
  soloStreaks,
  stripe,
  users: {
    ...users,
    friends
  }
};
