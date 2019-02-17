import { soloStreakRegistrationValidationMiddleware } from "../../Middleware/Validation/SoloStreak/soloStreakRegistrationValidationMiddleware";

export const createSoloStreakMiddlewares = [
    soloStreakRegistrationValidationMiddleware,
    // retreiveUserWhoCreatedStreakMiddleware,
    // createStreakFromRequestMiddleware,
    // saveStreakToDatabaseMiddleware,
    // sendFormattedStreakMiddleware
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

Should it be a different API call for a solo streak vs a group streak? 

This does make it easier to sort everything out because then I could 
organize streaks easier it will also be easier to add put, post, get and delete
routes if it is Solo Streaks and Group Streaks. Do these get there own collection
or should it just be a type of streak? 

Can a solo streak transform into a group streak? Yes because my example was I started a
Spanish streak and would then want to invite someone along. But in this case would it have been 
better to start a new streak as a group and maintain my solo streak as well? Guess I will 
just have to build it and see what people prefer to answer this question. 
*/