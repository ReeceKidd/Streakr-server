"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ResponseCodes;
(function (ResponseCodes) {
    ResponseCodes[ResponseCodes["success"] = 200] = "success";
    ResponseCodes[ResponseCodes["created"] = 201] = "created";
    ResponseCodes[ResponseCodes["deleted"] = 204] = "deleted";
    ResponseCodes[ResponseCodes["partialContent"] = 206] = "partialContent";
    ResponseCodes[ResponseCodes["badRequest"] = 400] = "badRequest";
    ResponseCodes[ResponseCodes["unprocessableEntity"] = 422] = "unprocessableEntity";
    ResponseCodes[ResponseCodes["unautohorized"] = 401] = "unautohorized";
    ResponseCodes[ResponseCodes["forbidden"] = 403] = "forbidden";
})(ResponseCodes = exports.ResponseCodes || (exports.ResponseCodes = {}));
//# sourceMappingURL=responseCodes.js.map