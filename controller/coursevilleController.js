const dotenv = require("dotenv");
dotenv.config();

// FOR MCV

const https = require("https");
const url = require("url");
const querystring = require("querystring");

// ------------------------------------------------------------------

// FOR DATABASE

const { v4: uuidv4 } = require("uuid");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  PutCommand,
  DeleteCommand,
  ScanCommand,
} = require("@aws-sdk/lib-dynamodb");

const docClient = new DynamoDBClient({ regions: process.env.AWS_REGION });

// ------------------------------------------------------------------


// BASE FUNCTION FOR MCV
// ALREADY FILLED
const redirect_uri = `http://${process.env.backendIPAddress}/courseville/access_token`;
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
              Location: `http://${process.env.frontendIPAddress}/index.html`, // ALREADY CHANGED
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

// ---------------------------------------------------------------------------------------------------------

// FUNCTION FOR MCV

exports.getUserInfo = (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const profileReq = https.request(
      "https://www.mycourseville.com/api/v1/public/get/user/info",
      profileOptions,
      (profileRes) => {
        let profileData = "";
        profileRes.on("data", (chunk) => {
          profileData += chunk;
        });
        profileRes.on("end", () => {
          const profile = JSON.parse(profileData);
          res.send(profile);
          res.end();
        });
      }
    );
    profileReq.on("error", (err) => {
      console.error(err);
    });
    profileReq.end();
  } catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

exports.getProfileInformation = (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const profileReq = https.request(
      "https://www.mycourseville.com/api/v1/public/users/me",
      profileOptions,
      (profileRes) => {
        let profileData = "";
        profileRes.on("data", (chunk) => {
          profileData += chunk;
        });
        profileRes.on("end", () => {
          const profile = JSON.parse(profileData);
          res.send(profile);
          res.end();
        });
      }
    );
    profileReq.on("error", (err) => {
      console.error(err);
    });
    profileReq.end();
  } catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

exports.getCourses = (req, res) => {
  try {
    const profileOptions = {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    };
    const profileReq = https.request(
      "https://www.mycourseville.com/api/v1/public/get/user/courses?detail=1",
      profileOptions,
      (profileRes) => {
        let profileData = "";
        profileRes.on("data", (chunk) => {
          profileData += chunk;
        });
        profileRes.on("end", () => {
          const profile = JSON.parse(profileData);
          res.send(profile);
          res.end();
        });
      }
    );
    profileReq.on("error", (err) => {
      console.error(err);
    });
    profileReq.end();
  } catch (error) {
    console.log(error);
    console.log("Please logout, then login again.");
  }
};

exports.getCourseAssignments = (req, res) => {
  const cv_cid = req.params.cv_cid;
  const url = `https://www.mycourseville.com/api/v1/public/get/course/assignments?cv_cid=${cv_cid}`;

  const courseReq = https.request(
    url,
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    },
    (courseRes) => {
      let data = "";
      courseRes.on("data", (chunk) => {
        data += chunk;
      });
      courseRes.on("end", () => {
        const dataJson = JSON.parse(data);
        res.send(dataJson);
      });
    }
  );
  courseReq.on("error", (err) => {
    res.status(400).send({ message: "error" });
  });
  courseReq.end();
};


exports.getAssignmentDetail = (req, res) => {
  const itemid = req.params.item_id;

  const url = `https://www.mycourseville.com/api/v1/public/get/item/assignment?item_id=${itemid}`;

  const courseReq = https.request(
    url,
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    },
    (courseRes) => {
      let data = "";
      courseRes.on("data", (chunk) => {
        data += chunk;
      });
      courseRes.on("end", () => {
        const dataJson = JSON.parse(data);
        res.send(dataJson);
      });
    }
  );
  courseReq.on("error", (err) => {
    res.status(400).send({ message: "error" });
  });
  courseReq.end();
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("https://www.mycourseville.com/api/logout");
  res.end();
};

exports.getCourseInfo = (req, res) => {
  const cv_cid = req.params.cv_cid;
  const url = `https://www.mycourseville.com/api/v1/public/get/course/info?cv_cid=${cv_cid}`;

  const courseReq = https.request(
    url,
    {
      headers: {
        Authorization: `Bearer ${req.session.token.access_token}`,
      },
    },
    (courseRes) => {
      let data = "";
      courseRes.on("data", (chunk) => {
        data += chunk;
      });
      courseRes.on("end", () => {
        const dataJson = JSON.parse(data);
        res.send(dataJson);
      });
    }
  );
  courseReq.on("error", (err) => {
    res.status(400).send({ message: "error" });
  });
  courseReq.end();
};

// ---------------------------------------------------------------------------------------------------------