"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../../Models/User");
class UserRouter {
    static getAllUsers(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, partialTextSearchQuery } = UserRouter.getQueryParams(request.query);
            if (partialTextSearchQuery) {
                const users = yield UserRouter.getUsersFromPartialTextSearchQuery(partialTextSearchQuery);
                return response.send({ users });
            }
            const standardQuery = UserRouter.getStandardQuery(firstName, lastName, email);
            const users = yield UserRouter.getUsersFromStandardQuery(standardQuery);
            return response.send({ users });
        });
    }
    static getUsersFromStandardQuery(query) {
        return User_1.default.find(Object.assign({}, query));
    }
    static getStandardQuery(firstName, lastName, email) {
        return {
            firstName,
            lastName,
            email
        };
    }
    static getUsersFromPartialTextSearchQuery(partialTextSearchQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            const regexSearch = this.getPartialTextRegularExpression(partialTextSearchQuery);
            return User_1.default.aggregate([
                { $addFields: { name: { $concat: ["$firstName", " ", "$lastName"] } } },
                {
                    $match: {
                        $or: [
                            { name: { $regex: regexSearch } },
                            { userName: { $regex: regexSearch } }
                        ]
                    }
                }
            ]);
        });
    }
    static getPartialTextRegularExpression(partialTextSearchQuery) {
        return new RegExp(partialTextSearchQuery, "i");
    }
    static getQueryParams(requestQuery) {
        return {
            firstName: this.getFirstName(requestQuery),
            lastName: this.getLastName(requestQuery),
            email: this.getEmail(requestQuery),
            partialTextSearchQuery: this.getPartialTextSearchQuery(requestQuery)
        };
    }
    static getDefaultUndefinedValue() {
        return { $ne: null };
    }
    static getFirstName(requestQuery) {
        return requestQuery.firstName || this.getDefaultUndefinedValue();
    }
    static getLastName(requestQuery) {
        return requestQuery.lastName || this.getDefaultUndefinedValue();
    }
    static getEmail(requestQuery) {
        return requestQuery.email || this.getDefaultUndefinedValue();
    }
    static getPartialTextSearchQuery(requestQuery) {
        return requestQuery.partialTextSearchQuery;
    }
}
exports.UserRouter = UserRouter;
// private static getUserById(userID: string){
//   // NEED TO CONVERT THIS INTO A PROMISE FOR THIS TO WORK> 
//   return new Promise((resolve, reject) => {
//     UserModel.findById(userID, (err, user) => {
//       if (err) return err
//       return user;
//     });
//   })
// }
// Need to hash the password on user registration. 
// public static async register(request: Request, response: Response) {
//   try {
//     const { userName, email, password} = request.body
//     const hashedPassword = await Authentication.setHashedPassword(password)
//     const newUser = UserUtils.createUserFromRequest(userName, email, hashedPassword)
//     await UserDatabaseHelper.saveUserToDatabase(newUser)
//     return response.status(200).send(newUser)
//   } catch(err){
//     return response.status(500).send({message: err.message})
//   }
// }
//   public static async login(req: Request, res: Response){
//     console.log('Entered method.')
//     try {
//       console.log(req.body)
//       const {userName, password } = req.body;
//       const user: IUser = await UserModel.findOne({userName}).lean()
//       console.log(user)
//       if(!user){
//         return res.status(400).send(`No user with userName:${userName} found`)
//       }
//       const hashedUserPassword: string = await Authentication.getHashedPassword(user.password)
//       console.log(hashedUserPassword)
//       const passwordsMatch = await Authentication.comparePasswordToHashedPassword(password, hashedUserPassword);
//       if(passwordsMatch) return res.status(200).send({message: 'Passwords match'})
//       return res.status(404).send({message: `Passwords don't match`});
//     } catch(err){
//       res.status(500).send(err)
//     }
//   }
// }
exports.default = UserRouter;
//# sourceMappingURL=user.js.map