"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streak_1 = require("./routes/streak");
const user_1 = require("./routes/user");
class Routes {
    routes(app) {
        /*
        USER ROUTES
        */
        app.route('/user').get(user_1.default.get).post(user_1.default.post);
        app.route('/user/:id').get(user_1.default.getById).delete(user_1.default.delete).put(user_1.default.update);
        /*
        STREAK ROUTES
        */
        app.route('/streak').get(streak_1.default.get).post(streak_1.default.post);
        app.route('/streak/:id').get(streak_1.default.getById).delete(streak_1.default.delete).put(streak_1.default.update);
    }
}
exports.Routes = Routes;
//# sourceMappingURL=route.js.map