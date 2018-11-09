
import  StreakRouter from 'routes/Streak/streak';
import  UserRouter  from 'routes/User/user';
import { validate } from 'joiValidation'

export class Routes {

    public routes(app): void {
        /*
        USER ROUTES
        */
        app.route('/users').get(UserRouter.getAllUsers);
        app.route('/user/:userID').get(UserRouter.getById).delete(UserRouter.delete).put(UserRouter.update)
        app.route('/user/login').validate(UserSchema).post(UserRouter.login)
        app.route('/user/register').post(UserRouter.register)
        /*
        STREAK ROUTES
        */
        app.route('/streak').get(StreakRouter.get).post(StreakRouter.post)
        app.route('/streak/:id').get(StreakRouter.getById).delete(StreakRouter.delete).put(StreakRouter.update)
    }
}