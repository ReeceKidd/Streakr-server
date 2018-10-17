import app from "../lib/app";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import UserModel from "../lib/models/User";
import { postUser } from "./test-data";

chai.use(chaiHttp);
const expect = chai.expect;


describe("POST /user tests", () => {
  it("Should successfully post a new user", async () => {
    const response = await chai
      .request(app)
      .post("/user")
      .send(postUser);
    expect(response.body)
      .to.have.property("firstName")
      .eql(postUser.firstName);
    expect(response.body)
      .to.have.property("lastName")
      .eql(postUser.lastName);
    expect(response.body)
      .to.have.property("streaks")
      .eql([]);
  });
});

after(async () => {
  try {
    return UserModel.remove({});
  } catch (error) {
  }
});
