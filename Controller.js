const dotenv = require("dotenv");
dotenv.config();

// FOR MCV
const https = require("https");
const url = require("url");
const querystring = require("querystring");

// ----------------------------------------------

// FOR DATABASE

const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

// ----------------------------------------------


// BASE FUNCTION FOR MCV
// ALREADY FILL
const redirect_uri = `http://${process.env.backendIPAddress}/home/access_token`;
const authorization_url = `https://www.mycourseville.com/api/oauth/authorize?response_type=code&client_id=${process.env.client_id}&redirect_uri=${redirect_uri}`;
const access_token_url = "https://www.mycourseville.com/api/oauth/access_token";

exports.authApp = (req, res) => {
    res.redirect(authorization_url);
};

exports.accessToken = (req, res) => {
  const parsedUrl = url.parse(req.url);
  const parsedQuery = querystring.parse(parsedUrl.query);

  if (parsedQuery.error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end(`Authorization error: ${parsedQuery.error_description}`);
    return;
  }

  if (parsedQuery.code) {
    const postData = querystring.stringify({
    grant_type: "authorization_code",
    code: parsedQuery.code,
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    redirect_uri: redirect_uri,
  });

  const tokenOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };

  const tokenReq = https.request(
    access_token_url,
    tokenOptions,
    (tokenRes) => {
      let tokenData = "";
      tokenRes.on("data", (chunk) => {
          tokenData += chunk;
      });
      tokenRes.on("end", () => {
        const token = JSON.parse(tokenData);
        req.session.token = token;
        console.log(req.session);
        if (token) {
            res.writeHead(302, {
            Location: `http://${process.env.frontendIPAddress}/home.html`,  // NEED TO CHANGE
            });
            res.end();
        }
      });
    }
  );

  tokenReq.on("error", (err) => {
      console.error(err);
  });
  tokenReq.write(postData);
  tokenReq.end();

  } else {
    res.writeHead(302, { Location: authorization_url });
    res.end();
  }
};

// ----------------------------------------------

// IMPLEMENT OTHER FUNCTIONS BELOW