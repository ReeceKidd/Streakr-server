// import app from "../lib/app";
// import * as chai from "chai";
// import chaiHttp = require("chai-http");
// import UserModel from "../lib/models/User";
// import { loginUser, userData1 } from "./test-data";
// import { API_VERBS, TEST_CASES } from "./TestEnums";

// enum Tests {
//   PASSWORDS_MATCH = "Passwords should match"
// }

// const API_ROUTE = "/user/login";
// const API_VERB = API_VERBS.POST;

// chai.use(chaiHttp);
// const expect = chai.expect;

// let user1;

// before(async () => {
//   try {
//     const [user1] = await Promise.all([
//         chai
//           .request(app)
//           .post("/user")
//           .send(userData1),
//       ]);
//   } catch (error) {}
// });

// describe(`${API_VERB} ${API_ROUTE} ${TEST_CASES.VALID}`, () => {
//   it(Tests.PASSWORDS_MATCH, async () => {
//       const request = {password: user1.password, userName: user1.userName}
//     const response = await chai
//       .request(app)
//       .post(API_ROUTE)
//       .send(request)
//     expect(response.status).to.equal(200);
    
//   });
// });

// after(async () => {
//   try {
//     return UserModel.remove({});
//   } catch (error) {}
// });
