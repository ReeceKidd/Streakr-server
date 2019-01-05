export const getDecodedTokenCallback = (err, decodedToken) => {
    return new Promise((resolve, reject) => {
      if (err) reject(err);
      resolve(decodedToken);
    });
  };