import snoowrap from "snoowrap";

const reddit = new snoowrap({
  userAgent: process.env.REDDIT_USER_AGENT as string,
  clientId: process.env.REDDIT_CLIENT_ID as string,
  clientSecret: process.env.REDDIT_CLIENT_SECRET as string,
  username: process.env.REDDIT_USERNAME as string,
  password: process.env.REDDIT_PASSWORD as string,
});

export default reddit;
