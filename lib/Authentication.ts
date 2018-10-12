import * as bcrypt from "bcrypt";

export default class Auth {
  public static hashPassword(
    passwordToHash: string
  ): Promise<string> {
      const saltRounds = 10;
    return new Promise((resolve, reject) => {
      bcrypt.hash(passwordToHash, saltRounds, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
  }

  public static compare(password: string, dbHash: string) {
    console.log(password, dbHash)
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, dbHash, (err, match) => {
        if (match) {
          resolve(match)
        } else {
          reject(err)
        }
      });
    })
  }
}
