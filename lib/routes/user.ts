import { Request, Response } from "express";
import UserModel from "../models/User";
import Authentication from "../Authentication";
import { IUser } from "Interfaces";

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

  public static getById(req: Request, res: Response) {
    UserModel.findById(req.params.id, (err, user) => {
      if (err) return res.send(err);
      return res.json(user);
    });
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

  public static async post(req: Request, res: Response) {
    
    if(req.body.password !== req.body.comparePassword){
      return res.status(404).send('Password and compare password do not match.')
    }
    req.body.password = await Authentication.hashPassword(req.body.password);

    const newUser = new UserModel(req.body);
    newUser.save(async (err, user) => {
      if (err) return res.send(err);
      const validatedUser = await UserModel.findById(user.id)
      return res.send(validatedUser)
    });
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
      const hashedUserPassword: string = await Authentication.hashPassword(user.password)
      console.log(hashedUserPassword)
      const passwordsMatch = await Authentication.compare(password, hashedUserPassword);
      if(passwordsMatch) return res.status(200).send({message: 'Passwords match'})
      return res.status(404).send({message: `Passwords don't match`});
    } catch(err){
      res.status(500).send(err)
    }
  
  }

}

export default UserRouter;
