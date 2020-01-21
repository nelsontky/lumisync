let request = require("request");
// require("request-debug")(request);
// USe fetch

const UserName = "nusstu\\E0310498";
const Password = "op9h3uenzdxhaf$";
const AuthMethod = "FormsAuthentication";

const loginData = {
  UserName,
  Password,
  AuthMethod
};

const auth =
  "https://vafs.nus.edu.sg/adfs/oauth2/authorize?response_type=code&client_id=E10493A3B1024F14BDC7D0D8B9F649E9-234390&redirect_uri=https%3A%2F%2Fluminus.nus.edu.sg%2Fauth%2Fcallback&scope=&resource=sg_edu_nus_oauth";

const getBearer = "https://luminus.nus.edu.sg/v2/api/login/adfstoken";

function authorization() {
  return new Promise((resolve, reject) => {
    request(
      {
        method: "POST",
        uri: auth,
        form: loginData
      },
      (err, res, body) => {
        const getUrl = res.headers.location;
        const cookie = res.headers["set-cookie"][0];

        request(
          {
            method: "GET",
            uri: getUrl,
            headers: {
              Cookie: cookie
            }
          },
          (err, res, body) => {
            const code = res.request.uri.search.split("?code=")[1];

            const form = {
              grant_type: "authorization_code",
              client_id: "E10493A3B1024F14BDC7D0D8B9F649E9-234390",
              resource: "sg_edu_nus_oauth",
              code,
              redirect_uri: "https://luminus.nus.edu.sg/auth/callback"
            };

            request(
              {
                method: "POST",
                uri: getBearer,
                form,
                json: true
              },
              (err, res, body) => resolve(body.access_token)
            );
          }
        );
      }
    );
  });
}

module.exports = authorization;
