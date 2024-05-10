require("dotenv").config();

import Filter from "bad-words";
import { isWithinTokenLimit } from "gpt-tokenizer";
import reddit from "./reddit";
import openAiInstance from "./openai";
import twitter from "./twitter";

const filter = new Filter();
const yesterdayAt9AM = new Date();
yesterdayAt9AM.setDate(yesterdayAt9AM.getDate() - 1);
yesterdayAt9AM.setHours(9, 0, 0, 0);
const requestTokenLimit = 15000;
const responseTokenBoundary = 2000;

interface RedditPost {
  selftext: string;
}

const sanitizeText = (text: string) => {
  if (text && text !== "") {
    return filter.clean(text);
  }
  return "";
};

const fetchPostsBetweenTimeFrame = async (startDate: Date, endDate: Date) => {
  const subreddit = reddit.getSubreddit("wallstreetbets");
  const posts = await subreddit.getNew({
    limit: parseInt(process.env.REDDIT_QUERY_LIMIT as string, 10),
  });

  // Convert posts to an array with filtered results
  const filteredPosts = posts.filter((post: { created_utc: number }) => {
    const createdTime = post.created_utc * 1000; // Convert UTC timestamp to milliseconds
    return (
      createdTime >= startDate.getTime() && createdTime <= endDate.getTime()
    );
  });

  return filteredPosts;
};

const analyzeGroupedPosts = async (posts: { selftext: string }[]) => {
  let counter = 1;

  let completePostText = ``;

  for (const post of posts) {
    const sanitizedPostContent = sanitizeText(post.selftext);
    let additionalTokens = `Reddit Post ${counter}: ${sanitizedPostContent}\n\n`;
    const additionalTokensLength = isWithinTokenLimit(
      additionalTokens,
      Number.MAX_SAFE_INTEGER
    ) as number;
    const currentTokenLength = isWithinTokenLimit(
      completePostText,
      Number.MAX_SAFE_INTEGER
    ) as number;

    if (
      additionalTokensLength + currentTokenLength <
      requestTokenLimit - responseTokenBoundary
    ) {
      completePostText += additionalTokens;
      counter++;
    } else {
      break;
    }
  }

  const prompt = `
  Identify ALL of the stock tickers mentioned in the following Reddit posts and rate the sentiment for each from -10 (very negative) to +10 (very positive). for investing into today. I plan on holding them for at least 30 days. 
  The reddit posts are separated by "Reddit Post (number)". 
  Make sure to ONLY return the ticker followed by the analysis, separated by a ":", organized in an array and NO OTHER TEXT. Add a $ sign before every ticker.
  If there are no stocks mentioned, return an empty array.


  Posts: 
  ${completePostText}
  `;

  try {
    const response = await openAiInstance.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
      temperature: 0.2,
    });
    return response?.choices[0]?.message?.content?.trim() || "";
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error analyzing post`, err.message);
    }
    return "[]";
  }
};

const parseAndTweetSentimentResults = (results: string) => {
  try {
    const tickerSentimentPairs = JSON.parse(results) as string[];
    postTweet(createTwitterPost(tickerSentimentPairs));
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error parsing sentiment results:", err.message);
    }
  }
};

const analyzeAndStorePosts = async (posts: RedditPost[]) => {
  const sentimentResults = await analyzeGroupedPosts(posts);
  parseAndTweetSentimentResults(sentimentResults);
};

const createTwitterPost = (dataArray: string[]) => {
  const header = "Stock Sentiment Scores:";
  const items = dataArray.map((item) => `- ${item}`).join("\n");
  return `${header}\n${items}`;
};

const postTweet = (tweet: string) => {
  twitter.v2.tweet(tweet);
};

const main = async () => {
  const newPosts = await fetchPostsBetweenTimeFrame(yesterdayAt9AM, new Date());
  if (newPosts.length > 0) {
    await analyzeAndStorePosts(newPosts);
  } else {
    console.log("No new posts found.");
  }
};

main();
