---
title: 'Creating a Twitter bot with JavaScript'
date: '2021-09-15'
tags: ['javascript', 'js', 'twitter-bot']
draft: false
summary: 'Step-by-step guide to creating and hosting your own Twitter bot'
image: '/static/images/article-images/twitter-bot.png'
isTop: true
---

I got back into using Twitter 2 months ago when I started my 100DaysOfCode journey. While posting my progress each day, I got curious about the bots that like and retweet my posts. Finally decided to create my own and experiment with the Twitter APIs.

![](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/l4bwyo6vw1q4qwbvgsk8.png)

Let's go through the whole process step by step. Before getting started, lets have a look at the Twitter APIs.

## Twitter APIs

There are a number of things Twitter allows you to do programmatically from your bot account.

It has different versions and tiers of APIs

- Twitter API v2
- Twitter API - Enterprise
- Twitter API - Premium v1.1
- Twitter API - Standard v1.1
- Twitter Ads API

What we get for free and will use in this tutorial are **Standard v1.1** and **v2**

v1.1 is the Standard API and v2 is a few additional methods on top of it.

### Popular methods and uses

1. Search for tweets

   - [GET /2/tweets/search/recent](https://developer.twitter.com/en/docs/twitter-api/tweets/search/api-reference/get-tweets-search-recent) - Searches and returns a specified number of results only in recent tweets.

2. Status Update

   - [POST /1.1/statuses/update](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-update) - accepts a status text and tweets it from the Bot account.

3. Retweets
   - [POST /1.1/statuses/retweet/:id](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/post-and-engage/api-reference/post-statuses-retweet-id) - retweets the tweet with the provided id from the Bot account.

We will use these 3 APIs but there are many other possibilities. For example, the bot can search through its own tweets, un-retweet it, delete an old tweet, create favorites, etc.

Check out the entire [API reference](https://developer.twitter.com/en/docs/api-reference-index) for more details.

Once you have an idea about what you are going to build and what APIs you are going to use, its time to move onto building things. First of all, we are going to apply for a developer account.

## Applying for a developer account

Prerequisite - You need to have a twitter account. You can either use your own account or create a new twitter account for your bot. Whichever account you use will require you to have a verified email id and phone number attached to it.

### Steps to follow

1. Sign in into the twitter account
2. Apply for developer access - Use the link to the [application process](https://developer.twitter.com/en/apply-for-access)
3. Fill out the application - It will ask you questions regarding the purpose of your app, verify your phone number and email if not already verified and answer a few questions about how you are going to use the developer account.

Once you are done with the process, you will have a [Dashboard](https://developer.twitter.com/en/portal/projects-and-apps) when approved. Generally, approval is instantaneous.

## Creating an App and Getting Security Tokens

1. On the Dashboard, we first need to create a project if we want to use API v2. Click on **Create a project** and give it a name.
2. Once the project is created, you will find a *Create an app"*button. Click on it to start creating your first app.
   ![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/n4zwqh0spv2r6bf6fxga.png)
3. Enter App name and click next. You will land on the Keys and Tokens section which will display **API Key, API Key Secret and Bearer Token**. Copy these values and keep them safe with you.
4. Click on next to create the app.
5. After creating the app, you will land on the Dashboard. You will find you App displayed. Click on the Settings Icon next to it.
6. Edit the App Permissions section. By default, your app has only read permissions, we will allow it read and write permissions which will enable it to make tweets. If you have to use the Direct Messages feature as well, you can enable that as well.
   ![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/vccs0xwgdwzycho8bzwb.png)

7. Take a look at the **Keys and tokens** tab
   ![image](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4qj2su64fvf6qno7vd4v.png)
   We are going to need all these keys - Consumer Keys - Click on regenerate. Copy the key and secret that appear. You cannot view them again, you can only regenerate them if you forget them. - Authentication Tokens - These are used to interact with the linked user account. Regenerate both sections. Copy and save the values that are created.

So our configuration is all set. We have saved a bunch of keys and tokens. Now let's have a look at how the authentication works.

## Authentication

Without going too deep into OAuth, I will explain which kind of keys and tokens needs to be used in which scenario. You will not need to understand more than that. So if you are new to authentication headers, you can ignore the confusing terminology for now. It will be clearer when we write the code.

1. **App authentication** - You are authenticating your app to make requests to the Twitter APIs. We need to follow one of the two ways below. **Both will use the Keys/Tokens we created while creating the App.**
   - Option 1: API Key and API Key Secret - Using OAuth1.0, add API Key and API Secret into the authorization headers
   - Option 2: Bearer Token - Using OAuth2.0, add the Bearer token in the authorization headers.
2. **User authentication** - Authorize your application to make tweets/changes from the connected user account. Here we will use the below 4 values we generated while giving our app permission to write for the account.
   - Consumer Key
   - Consumer Secret
   - Access Token
   - Access Token Secret

For example,

1. While searching for tweets, only the app authentication is required, so we will just use the Bearer Token.
2. While performing a status update, the user authentication is required, so we will use the 4 values mentioned above.

## The Development Environment

I will host the repo on Github and use Repl as my IDE and my runtime environment.

If you are new to Repl, here's a [quickstart guide](https://docs.replit.com/getting-started/intro-replit)

Repl is not mandatory for your bot, you can also use an offline IDE/ VS Code in browser and other deployment environments like Heroku, Netlify, AWS, Azure, etc. So choose whichever you are comfortable with.

I will demonstrate this with Repl and even after working with Azure for years, I found Repl as a perfect fit for this little project. It's completely free, provides easy ways to store environment variables, runs the app in your browser.

Get started by doing the below steps

1. Create a repo.
2. Import the repo in your IDE.
3. Initialize a new Node project - I use `npm init`. Fill in the required values.

## Twitter-Lite JS library

Although the library is not important and all API calls can be made with generic GET and POST requests, it takes care of all the boilerplate code and authorization headers for you and helps to focus on the app logic.

The library and its documentation can be found on [Github](https://github.com/draftbit/twitter-lite)

Let's install the library as a dependency

```javascript
npm install twitter-lite
```

## Let's write the code

What are we going to make?

1. Get recent tweets from a list of users.
2. Find the most happening tweet from that list.
3. Retweet or quote tweet it to share it with others.

### Creating API Clients

**An authenticated client for the app**

```javascript
const app = new TwitterLite({
  version: '2',
  extension: false,
  bearer_token: process.env.BEARER_TOKEN,
})
```

Defining the parameters:

1. version - default is 1.1. I have set it to 2 because I am going to user API v2 methods.
2. extension - false for v2. true by default for v1.1
3. bearer_token - Bearer token we saved above for the app.

With this client, the app can call all endpoints of the v2 API that do not make changes from a user account.

**Authenticated client for the user**

```javascript
const user = new TwitterLite({
  access_token_key: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_SECRET,
  consumer_key: process.env.CONS_KEY,
  consumer_secret: process.env.CONS_SECRET,
})
```

Parameters:

1. Auth parameters we saved above for user authentication.
2. Note that there are no version, extension parameters required as we will be tweeting using v1.1 Standard API.

### Search recent tweets

An example of a search query will be

```javascript
(from:username1 OR from:username2 OR from:username3) -is:reply -is:retweet
```

This query gets the tweets from any of the three users excluding those which are replies or retweets.

For exact steps to create the query, refer to the github repo. (Find link below)

Params:

```javascript
{
  start_time: '2021-09-15T03:10:41.161Z',
  max_results: 10,
  'tweet.fields': 'public_metrics',
  expansions: 'author_id',
  'user.fields': 'id,username',
  query: '(from:username1 OR from:username2 OR from:username3) -is:reply -is:retweet'
}
```

Parameters:

1. Start time - the timestamp from with the recent tweets need to be fetched
2. Max results - number of results to be returned. 10-100 is default. There is a monthly limit on the number of tweets you can retrieve, so choose the number accordingly.
3. `tweet.fields: 'public_metrics'` - will return metrics like likes, comments, retweets along with the text of the tweet.
4. user.fields - `user.fields` will return a User object of the user who tweeted it - I have only specified id and username.
5. `expansions: author_id`. User array and Tweet array will be separate. `author_id` in the Tweet object works like a foreign key to link with `id` field of the User object.

**Calling the API**

```javascript
const { meta, data, includes } = await app.get('tweets/search/recent', params)
```

Uses the app client.

The call returns the three objects

1. meta - metadata such as number of results returned.
2. data - array of Tweets
3. includes - related objects like the User array.

Next step will be to find the best tweet among these tweets based on public metrics. Simple math and comparisons. Refer to the code for the same.

What we need at the end is the `tweet id` and the `username` of the best tweet

### Retweeting/Quote tweeting

Based on switch or probability, the bot randomly chooses between retweeting and quote tweeting. Simple `Math.random()` logic.

Let's look at the API calls.

**Quote tweet**

```javascript
const { data } = await user.post('statuses/update', { status: status })
```

Here status is the text that will be tweeted. It will also contain a link to the quoted tweet. Another point to figure out with the codebase.

**Retweet**

```javascript
const { data } = await user.post('statuses/retweet/' + id)
```

As simple as that - `id` here is the best tweet id we figured out before.

And that's it. Now every time our code runs, it will find 10 recent tweets from certain users and will share the best of them.

Now let's look at some supporting details.

### Environment variables

All tokens and the user list are saved as environment variables. They should not be put into the code for the sake of security.

I have used Repl Secrets for the task. You can choose whatever way your environment provides.

### Deploying your bot and keeping it running

There are multiple ways to do this. One popular way bot makers follow is to put it on Heroku and make it run on scheduled timestamps. Same can be achieved with AWS Lambda and Azure Functions.

My way was to keep it on Repl itself. Not sure how popular this is but let me share the steps:

1. Keep the code on Repl.
2. Configure the Run button - [docs](https://docs.replit.com/programming-ide/configuring-run-button).
   - Add a .replit file to your Repl
   - Add language and command to it
     ```yml
     language = "bash"
     run = "node index.js"
     ```
3. Run it periodically - This is the interesting part.
   - An easy way to trigger a Repl is to hit its url https://repl-name.username.repl.co/
   - I'm going to put this url in a monitor which will hit the url for health checks at the defined interval.
   - UptimeRobot was the recommended solution but it did not work smoothly for me for small intervals.
   - Eventually chose a freemium tool - https://www.easycron.com/
   - Still using it in the free tier. Might switch over eventually.

That's it. Now the bot runs every hour and finds a new tweet to share. Provided the users have tweeted in that hour. Rarely misses because my user list is long.

---

Thanks for reading the article.

The code is on [Github](https://github.com/abh1navv/quote-tweet-bot)

And I'm on [Twitter](https://twitter.com/abh1navv) in case you want to reach out and say hello.

Oh wait! The [bot](https://twitter.com/quotinder) is on Twitter too. Come see how its doing.
