import { Router } from "express";

import { verifyJsonWebTokenMiddlewaresWithResponse } from "RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewaresWithResponse";

export const testPaths = {
    verifyJsonWebToken: "verify-json-web-token"
};

const testRouter = Router();

testRouter.post(
    `/${testPaths.verifyJsonWebToken}`,
    ...verifyJsonWebTokenMiddlewaresWithResponse)


export default testRouter;