import Authentication from "./authentication";

describe("Authentication - getHashedPassword", () => {
    it("should return hashed password", async() => {
        expect.assertions(1)
        const validPassword = "password"
        const hashedPassword = await Authentication.getHashedPassword(validPassword)
        expect(hashedPassword.length).toBeGreaterThan(validPassword.length)
    });
  });
  