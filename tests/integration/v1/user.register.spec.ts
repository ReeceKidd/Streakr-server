import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { ResponseCodes } from "../../../src/Server/responseCodes";

const userRegistationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

jest.setTimeout(120000);

describe(userRegistationRoute, () => {
  const userName = "tester1";
  const email = "tester1@gmail.com";
  const password = "12345678";

  afterAll(async done => {
    await userModel.deleteOne({ email });
    done();
  });

  test("user can register successfully", async done => {
    expect.assertions(9);
    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        userName,
        email,
        password
      });
    expect(response.status).toEqual(ResponseCodes.created);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("streaks");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("userName");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
    done();
  });
  test("fails because nothing is sent with request", async done => {
    expect.assertions(4);
    const response = await request(server).post(userRegistationRoute);
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "userName" fails because ["userName" is required]'
    );
    done();
  });

  test("fails because userName is missing from request", async done => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        email: "tester1@gmail.com",
        password: "12345678"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "userName" fails because ["userName" is required]'
    );
    done();
  });

  test("fails because userName already exists", async done => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        userName: "tester1",
        email: "tester001@gmail.com",
        password: "12345678"
      });
    expect(response.status).toEqual(ResponseCodes.badRequest);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      `User with userName: 'tester1' already exists`
    );
    done();
  });

  test("fails because userName must be a string", async done => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        userName: 1234567,
        email: "tester001@gmail.com",
        password: "12345678"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      `child \"userName\" fails because [\"userName\" must be a string]`
    );
    done();
  });

  test("fails because email is missing from request", async done => {
    expect.assertions(4);
    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        userName: "tester1",
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

  test("fails because email already exists", async done => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        userName: "tester01",
        email: "tester1@gmail.com",
        password: "12345678"
      });
    expect(response.status).toEqual(ResponseCodes.badRequest);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      `User with email: 'tester1@gmail.com' already exists`
    );
    done();
  });

  test("fails because email is invalid", async done => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        userName: "tester01",
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
      .post(userRegistationRoute)
      .send({
        userName: "tester1",
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
      .post(userRegistationRoute)
      .send({
        userName: "tester1",
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
      .post(userRegistationRoute)
      .send({
        userName: "tester1",
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
