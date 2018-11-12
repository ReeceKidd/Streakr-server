import UserModel from "./../models/User";

export class UserUtils {

    public static createUserFromRequest(userName: string, email: string, password: string){
        return new UserModel({userName, email, password})
      }
}