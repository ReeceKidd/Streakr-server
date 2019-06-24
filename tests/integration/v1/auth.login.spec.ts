import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { AuthPaths } from "../../../src/Routers/authRouter";
import { ResponseCodes } from "../../../src/Server/responseCodes";

const loginRoute = `/${ApiVersions.v1}/${RouteCategories.auth}/${AuthPaths.login}`;
const registrationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

const registeredEmail = "register@gmail.com";
const registeredUserName = "registeredUser";
const registeredPassword = "12345678";

jest.setTimeout(120000);

describe(loginRoute, () => {
  beforeAll(async done => {
    await request(server)
      .post(registrationRoute)
      .send({
        userName: registeredUserName,
        email: registeredEmail,
        password: registeredPassword
      });
    done();
  });

  afterAll(async done => {
    await userModel.deleteOne({ email: registeredEmail });
    done();
  });

  test("user can login successfully and receives jsonWebToken in response", async done => {
    expect.assertions(7);
    const response = await request(server)
      .post(loginRoute)
      .send({
        email: registeredEmail,
        password: registeredPassword
      });
    expect(response.status).toEqual(ResponseCodes.success);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("jsonWebToken");
    expect(response.body.jsonWebToken.length).toBeGreaterThan(20);
    expect(response.body).toHaveProperty("message");
    expect(response.body.expiry.expiresIn).toBeDefined();
    expect(response.body.expiry.unitOfTime).toEqual("seconds");
    done();
  });

  test("response is correct when incorrect email and password is used", async done => {
    expect.assertions(6);
    const response = await request(server)
      .post(loginRoute)
      .send({
        email: "invalidemail@gmail.com",
        password: "invalidPassword"
      });
    expect(response.status).toEqual(ResponseCodes.badRequest);
    expect(response.type).toEqual("application/json");
    expect(response.body).not.toHaveProperty("jsonWebToken");
    expect(response.body.message).toEqual("User does not exist.");
    expect(response.body.code).toEqual("400-02");
    expect(response.body.httpStatusCode).toEqual(400);
    done();
  });

  test("response is correct when invalid email and correct password is used", async done => {
    expect.assertions(6);
    const response = await request(server)
      .post(loginRoute)
      .send({
        email: "invalidemail@gmail.com",
        password: registeredPassword
      });
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body).not.toHaveProperty("jsonWebToken");
    expect(response.body.message).toEqual("User does not exist.");
    expect(response.body.code).toEqual("400-02");
    expect(response.body.httpStatusCode).toEqual(400);
    done();
  });

  test("response is correct when valid email and incorrect password is used", async done => {
    expect.assertions(6);
    const response = await request(server)
      .post(loginRoute)
      .send({
        email: registeredEmail,
        password: "invalidPassword"
      });
    expect(response.status).toEqual(400);
    expect(response.type).toEqual("application/json");
    expect(response.body).not.toHaveProperty("jsonWebToken");
    expect(response.body.message).toEqual("Password does not match hash.");
    expect(response.body.code).toEqual("400-03");
    expect(response.body.httpStatusCode).toEqual(400);
    done();
  });

  test("fails because nothing is sent with request", async done => {
    expect.assertions(4);
    const response = await request(server).post(loginRoute);
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "email" fails because ["email" is required]'
    );
    done();
  });

  test("fails because email is missing from request", async done => {
    expect.assertions(4);
    const response = await request(server)
      .post(loginRoute)
      .send({
        password: "12345678"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "email" fails because ["email" is required]'
    );
    done();
  });

  test("fails because email is invalid", async done => {
    expect.assertions(4);

    const response = await request(server)
      .post(loginRoute)
      .send({
        email: "invalid email",
        password: "12345678"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      `child \"email\" fails because [\"email\" must be a valid email]`
    );
    done();
  });

  test("fails because password is missing from request", async done => {
    expect.assertions(4);
    const response = await request(server)
      .post(loginRoute)
      .send({
        email: "tester1@gmail.com"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "password" fails because ["password" is required]'
    );
    done();
  });

  test("fails because password is less than 6 characters long", async done => {
    expect.assertions(4);
    const response = await request(server)
      .post(loginRoute)
      .send({
        email: "tester1@gmail.com",
        password: "1234"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "password" fails because ["password" length must be at least 6 characters long]'
    );
    done();
  });

  test("fails because password is not a string", async done => {
    expect.assertions(4);
    const response = await request(server)
      .post(loginRoute)
      .send({
        email: "tester1@gmail.com",
        password: 123456
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "password" fails because ["password" must be a string]'
    );
    done();
  });
});
