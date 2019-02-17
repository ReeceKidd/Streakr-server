import { soloStreakRegistrationValidationMiddleware } from "../../Middleware/Validation/SoloStreak/soloStreakRegistrationValidationMiddleware";
import { retreiveUserWithUserIdMiddleware } from "../../Middleware/Database/retreiveUserWithUserIdMiddleware";
import { userExistsValidationMiddleware } from "../../Middleware/Validation/User/userExistsValidationMiddleware";
import { createSoloStreakFromRequestMiddleware } from "../../Middleware/SoloStreak/createSoloStreakFromRequestMiddleware";
import { saveSoloStreakToDatabaseMiddleware } from "../../Middleware/Database/saveSoloStreakToDatabaseMiddleware";
import { sendFormattedSoloStreakMiddleware } from "../../Middleware/SoloStreak/sendFormattedSoloStreakMiddleware";

export const createSoloStreakMiddlewares = [
    soloStreakRegistrationValidationMiddleware,
    retreiveUserWithUserIdMiddleware,
    userExistsValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware
];

/*

May need to hire someone and ask them how best to organize the mongo 
db database when it comes to organising the streaks and user
Is it going to be ok for me to store the user information in 
the streak or should I just store a reference inside the streak to the user
Is it going to be likely that users will change there name? 
Porifle picture? I guess it is so I should just store a reference to the 
user in the streak? And then if I have a reference how do I actually 
populate this? Is this done on the database level or do I have to make an 
API call? 

Can a solo streak transform into a group streak? Yes because my example was I started a
Spanish streak and would then want to invite someone along. But in this case would it have been 
better to start a new streak as a group and maintain my solo streak as well? Guess I will 
just have to build it and see what people prefer to answer this question. 
*/