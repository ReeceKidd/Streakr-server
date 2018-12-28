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
const getDoesUserEmailExistMiddleware = (UserModel) => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email } = request.body;
        const user = yield UserModel.findOne({ email });
        if (user) {
            response.locals.emailExists = true;
        }
        ;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.getDoesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware;
//# sourceMappingURL=getDoesUserEmailExistMiddleware.js.map