# WallStreetBets Sentiment Analysis

This project performs sentiment analysis on the latest 100 posts from the WallStreetBets subreddit, covering posts from 9 AM yesterday to 9 AM today. The analysis runs automatically at 9 AM, Monday through Friday, using GPT-4o to evaluate sentiments expressed in the subreddit. The results are then tweeted. This tool is designed to aid in understanding sentiment trends but is not a substitute for professional investment advice.

## Getting Started

### Prerequisites

Before you can run this project, you'll need to have the following installed:
- Node.js
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/emptybigbucket/wsb-sentiment-analysis.git
   cd wsb-sentiment-analysis
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:
   ```plaintext
   REDDIT_USER_AGENT=your_reddit_user_agent
   REDDIT_CLIENT_ID=your_reddit_client_id
   REDDIT_CLIENT_SECRET=your_reddit_client_secret
   REDDIT_USERNAME=your_reddit_username
   REDDIT_PASSWORD=your_reddit_password
   TWITTER_API_KEY=your_twitter_api_key
   TWITTER_API_SECRET=your_twitter_api_secret
   TWITTER_API_ACCESS_TOKEN=your_twitter_access_token
   TWITTER_API_ACCESS_SECRET=your_twitter_access_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

### Usage

Before running the sentiment analysis, ensure `ts-node` is installed:
```bash
npm install -g ts-node
```

To run the sentiment analysis, execute:
```bash
ts-node src/index.ts
```

## Disclaimer

This project is intended for informational purposes only. **Do your own research:** The generated sentiment analysis is not financial advice. Tweets generated by this tool should not be used as the sole basis for any investment decisions. The accuracy of the sentiment analysis and the predictions made are not guaranteed.

## License

This project is open source and available under the [MIT License](LICENSE).
