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
const User_1 = require("../Models/User");
const DELETE_USER_MESSAGE = '"Successfully deleted user" ';
class UserDatabaseHelper {
    static saveUserToDatabase(newUser) {
        return new Promise((resolve, reject) => {
            newUser.save((err, user) => __awaiter(this, void 0, void 0, function* () {
                if (err)
                    reject(err);
                resolve(user);
            }));
        });
    }
    static doesUserEmailExist(email) {
        return new Promise((resolve, reject) => {
            User_1.default.findOne({ email: email }, (err, user) => {
                if (err)
                    reject(err);
                if (!user)
                    resolve(false);
                resolve(true);
            });
        });
    }
    static doesUserNameExist(userName) {
        return new Promise((resolve, reject) => {
            User_1.default.findOne({ userName: userName }, (err, user) => {
                if (err)
                    reject(err);
                if (!user)
                    resolve(false);
                resolve(true);
            });
        });
    }
    static deleteUser(_id) {
        return new Promise((resolve, reject) => {
            User_1.default.remove({ _id }, err => {
                if (err)
                    reject(err);
                resolve({ message: DELETE_USER_MESSAGE });
            });
        });
    }
    static updateUser(_id, updateObject) {
        return new Promise((resolve, reject) => {
            User_1.default.findOneAndUpdate({ _id }, updateObject, { new: true }, (err, user) => {
                reject(err);
                resolve(user);
            });
        });
    }
}
exports.UserDatabaseHelper = UserDatabaseHelper;
//# sourceMappingURL=userDatabaseHelper.js.map