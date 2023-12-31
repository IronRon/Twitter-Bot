/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// const { exec } = require('child_process')
// exec("cmd /c start http://tweet")


const fs = require("fs");
// const readline = require("readline");

// Database reference
const dbRef = admin.firestore().doc("tokens/demo");

// Twitter API init
const TwitterApi = require("twitter-api-v2").default;
const twitterClient = new TwitterApi({
  clientId: "",
  clientSecret: "",

});

const callbackURL = "http://callback";

const path = require("path");


// STEP 1 - Auth URL
exports.auth = functions.https.onRequest(async (request, response) => {
  const {url, codeVerifier, state} = twitterClient.generateOAuth2AuthLink(
      callbackURL,
      {scope: ["tweet.read", "tweet.write", "users.read", "offline.access"]},
  );

  // store verifier
  await dbRef.set({codeVerifier, state});

  response.redirect(url);
});

// STEP 2 - Verify callback code, store access_token
exports.callback = functions.https.onRequest(async (request, response) => {
  const {state, code} = request.query;

  const dbSnapshot = await dbRef.get();
  const {codeVerifier, state: storedState} = dbSnapshot.data();

  if (state !== storedState) {
    return response.status(400).send("Stored tokens do not match!");
  }

  const {
    client: loggedClient,
    accessToken,
    refreshToken,
  } = await twitterClient.loginWithOAuth2({
    code,
    codeVerifier,
    redirectUri: callbackURL,
  });

  await dbRef.set({accessToken, refreshToken});

  const {data} = await loggedClient.v2.me();
  // start using the client if you want

  response.send(data);
});

// STEP 3 - Refresh tokens and post tweets
exports.tweet = functions.https.onRequest(async (request, response) => {
  const {refreshToken} = (await dbRef.get()).data();

  const {
    client: refreshedClient,
    accessToken,
    refreshToken: newRefreshToken,
  } = await twitterClient.refreshOAuth2Token(refreshToken);

  await dbRef.set({accessToken, refreshToken: newRefreshToken});

  console.log("efddddddddddddddd");

  let tweetText = fs.readFileSync(path.resolve("quotes.txt"), (err, data) => { });
  tweetText = tweetText.toString();
  const result = tweetText.split(/\r?\n/);
  console.log(result[0]);

  const {data} = await refreshedClient.v2.tweet(
      // nextTweet.data.choices[0].text
      // "Black Clover>>>"
      result[0],
  );

  result[0] = "";
  fs.writeFileSync(path.resolve("quotes.txt"), result[0], (err) => { });

  for (let i = 1; i < result.length; i++) {
    fs.appendFileSync(path.resolve("quotes.txt"), result[i].concat("\n"), (err) => { });
  }

  console.log(data.text);

  response.send(data);
});




