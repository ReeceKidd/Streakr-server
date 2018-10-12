import app from "../lib/app";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import UserModel from "../lib/models/User";
import { NUMBER_OF_USERS, userData1, userData2 } from "./test-data";

chai.use(chaiHttp);
const expect = chai.expect;

before(async () => {
  try {
    return Promise.all([
      await chai
        .request(app)
        .post("/user")
        .send(userData1),
      await chai
        .request(app)
        .post("/user")
        .send(userData2)
    ]);
  } catch (error) {
  }
});

describe("GET /user tests VALID", () => {
  it("Should return all users", async () => {
    const response = await chai.request(app).get("/user");
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(NUMBER_OF_USERS);
  });
  it("Should return one user with firstName equal to user2", async () => {
    const response = await chai
      .request(app)
      .get(`/user?firstName=${userData2.firstName}`);
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(1);
    expect(response.body[0])
      .to.have.property("firstName")
      .eql(userData2.firstName);
    expect(response.body[0])
      .to.have.property("lastName")
      .eql(userData2.lastName);
    expect(response.body[0])
      .to.have.property("userName")
      .eql(userData2.userName);
    expect(response.body[0])
      .to.have.property("email")
      .eql(userData2.email);
    expect(response.body[0])
      .to.have.property("streaks")
      .eql([]);
  });
  it("Should return one user with lastName equal to data2", async () => {
    const response = await chai
      .request(app)
      .get(`/user?lastName=${userData2.lastName}`);
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(1);
    expect(response.body[0])
      .to.have.property("firstName")
      .eql(userData2.firstName);
    expect(response.body[0])
      .to.have.property("lastName")
      .eql(userData2.lastName);
    expect(response.body[0])
      .to.have.property("userName")
      .eql(userData2.userName);
    expect(response.body[0])
      .to.have.property("email")
      .eql(userData2.email);
    expect(response.body[0])
      .to.have.property("streaks")
      .eql([]);
  });
  it("Should return one user with email equal to user2@gmail.com", async () => {
    const response = await chai
      .request(app)
      .get(`/user?lastName=${userData2.lastName}`);
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(1);
    expect(response.body[0])
      .to.have.property("firstName")
      .eql(userData2.firstName);
    expect(response.body[0])
      .to.have.property("lastName")
      .eql(userData2.lastName);
    expect(response.body[0])
      .to.have.property("userName")
      .eql(userData2.userName);
    expect(response.body[0])
      .to.have.property("email")
      .eql(userData2.email);
    expect(response.body[0])
      .to.have.property("streaks")
      .eql([]);
  });
  it("Should return no users when firstName and lastName are matches but email is not", async () => {
    const response = await chai
      .request(app)
      .get(
        `/user?firstName=${userData2.firstName}&lastName=${
          userData2.lastName
        }&email=FALSE`
      );
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(0);
  });
  
});
describe("GET /user?tsearchQuery tests", () => {
  it("Should return user using text search on username", async () => {
    const response = await chai
      .request(app)
      .get(
        `/user?searchQuery=${userData2.userName}`
      );
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(1);
    expect(response.body[0])
      .to.have.property("firstName")
      .eql(userData2.firstName);
    expect(response.body[0])
      .to.have.property("lastName")
      .eql(userData2.lastName);
    expect(response.body[0])
      .to.have.property("userName")
      .eql(userData2.userName);
    expect(response.body[0])
      .to.have.property("email")
      .eql(userData2.email);
    expect(response.body[0])
      .to.have.property("streaks")
      .eql([]);
  });
  it("Should return user using text search on firstName + lastName", async () => {
    const response = await chai
      .request(app)
      .get(
        `/user?searchQuery=${userData2.firstName} ${userData2.lastName}`
      );
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(1);
    expect(response.body[0])
      .to.have.property("firstName")
      .eql(userData2.firstName);
    expect(response.body[0])
      .to.have.property("lastName")
      .eql(userData2.lastName);
    expect(response.body[0])
      .to.have.property("userName")
      .eql(userData2.userName);
    expect(response.body[0])
      .to.have.property("email")
      .eql(userData2.email);
    expect(response.body[0])
      .to.have.property("streaks")
      .eql([]);
  });
  it("Should not return anyone as search query has no matches", async () => {
    const response = await chai
      .request(app)
      .get(
        `/user?searchQuery=xx`
      );
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(0);
  });
  it("Should not return anyone due to additional character between first and last name", async () => {
    const response = await chai
      .request(app)
      .get(
        `/user?searchQuery=${userData2.firstName} x ${userData2.lastName}`
      );
    expect(response.body).to.be.an("array");
    expect(response.body).to.be.length(0);
  });
});

describe("GET /user/:id tests", () => {
  it("Should return user with specific ID", async () => {
    const getAllUsersResponse = await chai.request(app).get("/user");
    const userId = getAllUsersResponse.body[0]._id;
    const response = await chai.request(app).get(`/user/${userId}`);
    expect(response.body)
      .to.have.property("firstName")
    expect(response.body)
      .to.have.property("lastName")
    expect(response.body)
      .to.have.property("userName")
    expect(response.body)
      .to.have.property("email")
    expect(response.body)
      .to.have.property("streaks")
      .eql([]);
  });
});

after(async () => {
    try {
      return UserModel.remove({});
    } catch (error) {
      console.log(error);
    }
  });
