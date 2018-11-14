
import  StreakRouter from './routes/Streak/streak';
import  UserRouter  from './routes/User/user';
import { UserValidation } from './routes/User/user.validation'
import { celebrate, errors } from 'celebrate'


export class Routes {

    public routes(app): void {
        /*
        USER ROUTES
        */
        app.route('/users').get(UserRouter.getAllUsers);
        app.route('/user/login').post( UserRouter.login)
        app.route('/user/register').post(celebrate(UserValidation.register), UserRouter.register)
        /*
        STREAK ROUTES
        */
        app.route('/streak').get(StreakRouter.get).post(StreakRouter.post)
        app.route('/streak/:id').get(StreakRouter.getById).delete(StreakRouter.delete).put(StreakRouter.update)
        app.use(errors())
    }
}