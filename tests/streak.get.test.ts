import app from "../lib/app";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import StreakModel from "../lib/models/Streak";
import { IFixedTermStreak, ILastManStandingStreak } from "../lib/Interfaces";
import UserModel from "../lib/models/User";
import { userData1, userData2 } from "./test-data";
import routes from './routes'

let postStreak: IFixedTermStreak
let lastManStandingStreak: ILastManStandingStreak

chai.use(chaiHttp);
const expect = chai.expect;

const numberOfStreaks = 2;

before(async () => {
  try {
    const [userData1Response, userData2Response]  = await Promise.all([chai
    .request(app)
    .post(routes.user)
    .send(userData1),
    chai
    .request(app)
    .post(routes.user)
    .send(userData2)]);
    postStreak = {
      streakName: "Test",
      description: "User",
      createdBy: "TestUser",
      successCriteria: "Success",
      participants: [userData1Response.body._id, userData2Response.body._id],
      startDate: new Date(),
      endDate: new Date(),
      duration: 333,
    };
    lastManStandingStreak = {
        streakName: "Test",
        description: "User",
        createdBy: "TestUser",
        successCriteria: "Success",
        participants: [userData1Response.body._id, userData2Response.body._id],
        startDate: new Date(),
        lastManStanding: true
    }
    return Promise.all([
      await chai
        .request(app)
        .post(routes.streak)
        .send(postStreak),
      await chai
        .request(app)
        .post(routes.streak)
        .send(lastManStandingStreak)
    ]);
  } catch (error) {
    console.log(error)
  }
});

describe("GET /streak tests VALID", () => {
  it("Should return all streaks", async () => {
    const response = await chai.request(app).get(routes.streak);
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(numberOfStreaks);
  });
});

describe("GET /streak/:id tests", () => {
  it("Should return streak with specific ID", async () => {
    const getAllStreaksResponse = await chai.request(app).get(routes.streak);
    const streakId = getAllStreaksResponse.body[0]._id;
    const response = await chai.request(app).get(`${routes.streak}/${streakId}`);
    expect(response.body)
    .to.have.property("streakName")
    .eql(postStreak.streakName);
  expect(response.body)
    .to.have.property("description")
    .eql(postStreak.description);
  expect(response.body)
    .to.have.property("createdBy")
    .eql(postStreak.createdBy);
  expect(response.body)
    .to.have.property("users")
  });
});

after(async () => {
    try {
      return Promise.all([StreakModel.remove({}), UserModel.remove({})])
    } catch (error) {
      console.log(error);
    }
  });
