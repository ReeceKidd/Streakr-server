import request from "supertest";

import server from "../../../src/app";
import ApiVersions from "../../../src/Server/versions";
import { RouteCategories } from "../../../src/routeCategories";
import { userModel } from "../../../src/Models/User";
import { ResponseCodes } from "../../../src/Server/responseCodes";

const userRegistationRoute = `/${ApiVersions.v1}/${RouteCategories.users}`;

jest.setTimeout(120000);

describe(userRegistationRoute, () => {
  const username = "tester1";
  const email = "tester1@gmail.com";

  afterAll(async () => {
    await userModel.deleteOne({ email });
  });

  test("user can register successfully", async () => {
    expect.assertions(9);
    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        username,
        email
      });
    expect(response.status).toEqual(ResponseCodes.created);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("streaks");
    expect(response.body).toHaveProperty("role");
    expect(response.body).toHaveProperty("_id");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("createdAt");
    expect(response.body).toHaveProperty("updatedAt");
  });

  test("fails because nothing is sent with request", async () => {
    expect.assertions(4);
    const response = await request(server).post(userRegistationRoute);
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "username" fails because ["username" is required]'
    );
  });

  test("fails because username is missing from request", async () => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        email: "tester1@gmail.com"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "username" fails because ["username" is required]'
    );
  });

  test("fails because username already exists", async () => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        username: "tester1",
        email: "tester001@gmail.com"
      });
    expect(response.status).toEqual(ResponseCodes.badRequest);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(`Username already exists.`);
  });

  test("fails because username must be a string", async () => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        username: 1234567,
        email: "tester001@gmail.com"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      `child \"username\" fails because [\"username\" must be a string]`
    );
  });

  test("fails because email is missing from request", async () => {
    expect.assertions(4);
    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        username: "tester1"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      'child "email" fails because ["email" is required]'
    );
  });

  test("fails because email already exists", async () => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        username: "tester01",
        email: "tester1@gmail.com"
      });
    expect(response.status).toEqual(ResponseCodes.badRequest);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(`User email already exists.`);
  });

  test("fails because email is invalid", async () => {
    expect.assertions(4);

    const response = await request(server)
      .post(userRegistationRoute)
      .send({
        username: "tester01",
        email: "invalid email"
      });
    expect(response.status).toEqual(ResponseCodes.unprocessableEntity);
    expect(response.type).toEqual("application/json");
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toEqual(
      `child \"email\" fails because [\"email\" must be a valid email]`
    );
  });
});
