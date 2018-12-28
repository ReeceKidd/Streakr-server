"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSendFormattedUserMiddleware = (request, response, next) => {
    try {
        const { savedUser } = response.locals;
        savedUser.password = undefined;
        return response.send(savedUser);
    }
    catch (err) {
        next(err);
    }
};
exports.getSendFormattedUserMiddleware = getSendFormattedUserMiddleware;
//# sourceMappingURL=getSendFormattedUserMiddleware.js.map