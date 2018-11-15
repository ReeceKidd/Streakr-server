
import  StreakRouter from './routes/Streak/streak';
import  UserRouter  from './routes/User/user';
import { UserValidation } from './routes/User/user.validation'
import { celebrate, errors } from 'celebrate'
import {isAuthenticated} from '../config/passport'
import { UserDatabaseHelper } from './DatabaseHelpers/userDatabaseHelper';


export class Routes {

    public routes(app): void {
        /*
        USER ROUTES
        */
        app.route('/users').get(isAuthenticated, UserRouter.getAllUsers);
        app.route('/user/login').post(celebrate(UserValidation.login), UserDatabaseHelper.doesUserExist, UserRouter.login)
        app.route('/user/register').post(celebrate(UserValidation.register), UserRouter.register)
        /*
        STREAK ROUTES
        */
        app.route('/streak').get(StreakRouter.get).post(StreakRouter.post)
        app.route('/streak/:id').get(StreakRouter.getById).delete(StreakRouter.delete).put(StreakRouter.update)
        app.use(errors())
    }
}