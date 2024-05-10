import { TwitterApi } from "twitter-api-v2";

const twitter = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY as string,
  appSecret: process.env.TWITTER_API_SECRET as string,
  accessToken: process.env.TWITTER_API_ACCESS_TOKEN as string,
  accessSecret: process.env.TWITTER_API_ACCESS_SECRET as string,
});

export default twitter;
