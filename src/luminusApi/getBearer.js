const axios = require("axios");

const auth =
  "https://vafs.nus.edu.sg/adfs/oauth2/authorize?response_type=code&client_id=E10493A3B1024F14BDC7D0D8B9F649E9-234390&redirect_uri=https%3A%2F%2Fluminus.nus.edu.sg%2Fauth%2Fcallback&scope=&resource=sg_edu_nus_oauth";

const getBearer = "https://luminus.nus.edu.sg/v2/api/login/adfstoken";

async function authorization(username, password) {
  let formData = new URLSearchParams();
  formData.append("UserName", username);
  formData.append("Password", password);
  formData.append("AuthMethod", "FormsAuthentication");

  const response = await axios.post(auth, formData, { responseType: "json" });
  console.log(response.request.responseURL);
}

export default authorization;
