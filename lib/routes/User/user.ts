import { Request, Response } from "express";
import UserModel from "../../models/User";
import Authentication from "../../Authentication";
import { IUser } from "../../Interfaces";

export class UserRouter {
  public static async getAllUsers(request: Request, response: Response) {
    const { firstName, lastName, email, partialTextSearchQuery} = UserRouter.getQueryParams(request.query)
    
    if(partialTextSearchQuery){
      const users = await UserRouter.getUsersFromPartialTextSearchQuery(partialTextSearchQuery)
      return response.send({users})
    }

    const standardQuery = UserRouter.getStandardQuery(firstName, lastName, email)
    const users = await UserRouter.getUsersFromStandardQuery(standardQuery)
    return response.send({users});
  }


  private static getUsersFromStandardQuery(query: {firstName: string, lastName: string, email: string}){
    return UserModel.find({ ...query });
  }

  private static getStandardQuery(firstName: string, lastName: string, email: string){
    return {
      firstName, 
      lastName, 
      email
    }
  }

  private static async getUsersFromPartialTextSearchQuery(partialTextSearchQuery: string){
    const regexSearch = this.getPartialTextRegularExpression(partialTextSearchQuery)
      return UserModel.aggregate([
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
  }

  private static getPartialTextRegularExpression(partialTextSearchQuery: string){
    return new RegExp(partialTextSearchQuery, "i");
  }

  private static getQueryParams(requestQuery){
    return {
      firstName: this.getFirstName(requestQuery),
      lastName: this.getLastName(requestQuery),
      email: this.getEmail(requestQuery),
      partialTextSearchQuery: this.getPartialTextSearchQuery(requestQuery)
    }
  }

  private static getDefaultUndefinedValue(){
    return { $ne: null }
  }

  private static getFirstName(requestQuery){
    return requestQuery.firstName || this.getDefaultUndefinedValue();
  }

  private static getLastName(requestQuery){
    return requestQuery.lastName || this.getDefaultUndefinedValue()
  }

  private static getEmail(requestQuery){
    return requestQuery.email || this.getDefaultUndefinedValue()
  }

  private static getPartialTextSearchQuery(requestQuery){
    return requestQuery.partialTextSearchQuery
  }

  public static async getById(request: Request, response: Response) {
    const userID = this.getUserID(request.params.userID)
    const user = await this. getUserById(userID)
    return response.send({user})
  }

  private static getUserById(userID: string){
    // NEED TO CONVERT THIS INTO A PROMISE FOR THIS TO WORK> 
    return new Promise((resolve, reject) => {
      UserModel.findById(userID, (err, user) => {
        if (err) return err
        return user;
      });
    })
  }

  private static getUserID(userID: string){
    this.userIDValidation(userID)
    return userID
  }

  private static userIDValidation(userID){
    if(!userID) throw new Error("userID must be defined")
  }

  public static update(req: Request, res: Response) {
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true },
      (err, user) => {
        if (err) return res.send(err);
        return res.json(user);
      }
    );
  }

  public static delete(req: Request, res: Response) {
    UserModel.remove({ id: req.params.id }, err => {
      if (err) return res.send(err);
      return res.json({ message: "Successfully deleted user" });
    });
  }

  public static async register(request: Request, response: Response) {
    const { userName, email } = request.body
    const password = await Authentication.getHashedPassword(request.body.password);
    const newUser = this.createUserFromRequest(request.body)
    console.log(request.body)
    this.saveUserToDatabase(newUser)
    return response.send({newUser})
  }

  private static createUserFromRequest(requestBody){
    return new UserModel(requestBody)
  }

  private static saveUserToDatabase(newUser){
    return new Promise((resolve, reject) => {
      newUser.save(async (err, user) => {
        if (err) reject(err);
        const validatedUser = await this.retreiveCreatedUser(user.id)
        resolve(validatedUser)
      });
    });
  }

  private static retreiveCreatedUser(userId: string){
    return UserModel.findById(userId)
  }

  public static async login(req: Request, res: Response){
    console.log('Entered method.')
    try {
      console.log(req.body)
      const {userName, password } = req.body;
      const user: IUser = await UserModel.findOne({userName}).lean()
      console.log(user)
      if(!user){
        return res.status(400).send(`No user with userName:${userName} found`)
      }
      const hashedUserPassword: string = await Authentication.getHashedPassword(user.password)
      console.log(hashedUserPassword)
      const passwordsMatch = await Authentication.comparePasswordToHashedPassword(password, hashedUserPassword);
      if(passwordsMatch) return res.status(200).send({message: 'Passwords match'})
      return res.status(404).send({message: `Passwords don't match`});
    } catch(err){
      res.status(500).send(err)
    }
  
  }

}

export default UserRouter;
