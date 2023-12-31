const {TwitterApi} = require("twitter-api-v2");

const client = new TwitterApi({
    appKey: "",
    appSecret: "",
    accessToken: "",
    accessSecret: ""
})

const bearer = new TwitterApi("")

//Ali keys
// const client = new TwitterApi({
//     appKey: "",
//     appSecret: "",
//     accessToken: "",
//     accessSecret: ""
// })
// const bearer = new TwitterApi("")

const twitterBearer = bearer.readOnly
const rwClient = client.readWrite

module.exports = { rwClient, twitterBearer }