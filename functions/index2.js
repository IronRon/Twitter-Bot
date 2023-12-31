const { rwClient, twitterBearer } = require("./twitterClient.js");
const fs = require("fs");
const path = require("path");


const tweet = async () => {
    console.log("TweetBot Start\n");

    let tweetText = fs.readFileSync(path.resolve("quotes2.txt"), (err, data) => { });
    tweetText = tweetText.toString();
    //const result = tweetText.split(/\r?\n/);
    const result = tweetText.split("%%%");
    console.log(result[0]);

    try {
        await rwClient.v2.tweet(result[0])
    } catch (e) {
        console.error(e)
    }

    console.log("\nTweet Sent hopefully\n");

    //result[0] = "";
    fs.writeFileSync(path.resolve("quotes2.txt"), result[1], (err) => { });

    for (let i = 2; i < result.length - 1; i++) {
        fs.appendFileSync(path.resolve("quotes2.txt"), result[i].concat("%%%"), (err) => { });
    }
    fs.appendFileSync(path.resolve("quotes2.txt"), result[result.length - 1], (err) => { });

    console.log("\nDone\n");
}

const search = async () => {
    const whereTakenTweets = await twitterBearer.v2.search('#DBLegends');

    for await (const tweet of whereTakenTweets) {
        console.log(tweet);
    }
}

tweet()
//search()
