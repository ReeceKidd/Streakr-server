import app from "../lib/app";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import StreakModel from "../lib/models/Streak";
import UserModel from "../lib/models/User";
import { userData3, userData4 } from "./test-data";
import { IStreak, IFixedTermStreak, ILastManStandingStreak } from "../lib/Interfaces";

chai.use(chaiHttp);
const expect = chai.expect;

let user1;
let user2;

before(async () => {
  try {
    const [userData1Response, userData2Response] = await Promise.all([
      chai
        .request(app)
        .post("/user")
        .send(userData3),
      chai
        .request(app)
        .post("/user")
        .send(userData4)
    ]);
    [user1, user2] = await Promise.all([
      UserModel.findById(userData1Response.body),
      await UserModel.findById(userData2Response.body)
    ]);
  } catch (error) {
    console.log('Error:' + error)
  }
});

describe("POST /streak tests", () => {
  it("Should successfully post a new fixed term streak", async () => {
    const postStreak: IFixedTermStreak = {
      streakName: "Test",
      description: "User",
      createdBy: "TestUser",
      successCriteria: "Success",
      participants: [user1._id, user2._id],
      startDate: new Date(),
      endDate: new Date(),
      duration: 333
    };
    const response = await chai
      .request(app)
      .post("/streak")
      .send(postStreak);
    expect(response.body)
      .to.have.property("streakName")
      .eql(postStreak.streakName);
    expect(response.body)
      .to.have.property("description")
      .eql(postStreak.description);
    expect(response.body)
      .to.have.property("createdBy")
      .eql(postStreak.createdBy);
    expect(response.body).to.have.property("participants");
    expect(response.body).to.have.property("startDate");
    expect(response.body).to.have.property("endDate");
    expect(response.body).to.have.property("duration");
  });
  it("Should successfully post a new last man standing streak", async () => {
    const lastManStandingStreak: ILastManStandingStreak = {
      streakName: "Test",
      description: "User",
      successCriteria: "Success",
      createdBy: "TestUser",
      participants: [user1._id, user2._id],
      startDate: new Date(),
      lastManStanding: true
    };
    const response = await chai
      .request(app)
      .post("/streak")
      .send(lastManStandingStreak);
    expect(response.body)
      .to.have.property("streakName")
      .eql(lastManStandingStreak.streakName);
    expect(response.body)
      .to.have.property("description")
      .eql(lastManStandingStreak.description);
    expect(response.body)
      .to.have.property("createdBy")
      .eql(lastManStandingStreak.createdBy);
    expect(response.body).to.have.property("participants");
    expect(response.body).to.have.property("startDate");
    expect(response.body).to.have.property("lastManStanding");
  });
});

after(async () => {
  try {
    return Promise.all([UserModel.remove({}), StreakModel.remove({})]) 
  } catch (error) {
    console.log(error)
  }
});
