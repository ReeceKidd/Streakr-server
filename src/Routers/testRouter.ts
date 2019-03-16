import { Router } from "express";

import { verifyJsonWebTokenMiddlewaresWithResponse } from "../RouteMiddlewares/Utils/verifyJsonWebTokenMiddlewaresWithResponse";

export const TestPaths = {
    verifyJsonWebToken: "verify-json-web-token"
};

const testRouter = Router();

testRouter.post(
    `/${TestPaths.verifyJsonWebToken}`,
    ...verifyJsonWebTokenMiddlewaresWithResponse)


export default testRouter;
