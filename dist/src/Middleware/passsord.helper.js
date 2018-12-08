"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
exports.SALT_ROUNDS = 10;
class PasswordHelper {
    static injectDependencies(request, response, next) {
        response.locals.hash = bcrypt.hash;
        response.locals.comparePassword = bcrypt.compare;
        next();
    }
    static setHashedPassword(request, response, next) {
        const { hash } = response.locals;
        const { password } = request.body;
        new Promise((resolve, reject) => {
            hash(password, exports.SALT_ROUNDS, (err, hash) => {
                if (err)
                    reject(err);
                resolve(hash);
                next();
            });
        })
            .then(success => {
            response.send(success);
            console.log(success);
        })
            .catch(err => {
            console.log(err);
            response.send(err);
        });
    }
}
exports.PasswordHelper = PasswordHelper;
//# sourceMappingURL=passsord.helper.js.map