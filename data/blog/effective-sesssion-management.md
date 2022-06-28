---
title: 'Effective Session Management'
date: '2022-01-21'
tags: ['security', 'authorization', 'JWT']
draft: true
summary: 'Effective Session Management'
image: '/static/images/article-images/java-records.jpg'
---

# Effective Session Management

## An Ideal Session Management System

As discussed in the previous article, we are going to base our recommendation on the basis of scalability, security and user experience.
So let's define what an ideal system would look like in terms of these three attributes.

### User experience

- As a user, I do not want to have to log in every time I visit a page. In fact, I do not want to have to log in for long periods of time.
- Imagine logging in to Netflix after every episode. That is not a good experience.
- For this to be possible, the user should hold access tokens for a long time - generally days or weeks.
- **Access tokens need long expiry.**

### Scalability

- The server should be able to scale as needed without being hindered by the authorization process.
- The guideline we get from our analysis of reference tokens is that as much as possible, avoid interaction with server side storage.
- This means **value tokens are great for scalability.**

### Security

- Security is the most important, so while we try to provide good user experience and scalability, we cannot compromise on security.
- Keeping in mind the target of providing long expiry and using value tokens like JWT, let's look at the security considerations of such a setup.

**Security problems with long-lived JWTs**

We keep the JWT on the client side. This means that we have no control over its safety and theft. This is also true for reference tokens. Therefore, we need to be prepared for situations of token theft.

- If the token has a long expiry time, the attacker can use it to access the resource for a long time.
- It is hard for the application to detect if the request is coming from an attacker or the victim. Algorithms like IP/location tracking can be used but they are not efficient and can lead to a lot of false positives and false negatives leading to less security and deteriorated user experience respectively.
- It is hard for the application to invalidate JWTs if by any chance detection is made possible. The JWT contains its own validation information the application will always find it valid. One possible way is to store forcibly invalidated JWTs in a storage until they naturally expire and check each coming request for validity. - A performance mess!

### Rise of refresh tokens

This led to the concept of refresh tokens. Refresh tokens are used to extend user's session when their access token has expired or is about to expire.
Refresh tokens are typically **long-lived reference tokens which refer to a record stored on the server side**.
This allows the application to track the number of active sessions and devices per user. At the same time, it is easy to invalidate the refresh token if the user logs out or we need to make the user's session expire for some reason.

Refresh tokens allow us to use short-lived access tokens. Thus, the problems associated with access token theft and subsequent long attacks is mitigated.
However, refresh tokens are not immune to theft. But unlike access tokens, we have them stored in the backend. We can tie them down to a single session and invalidate them whenever needed. Let's see how Supertokens implements this.

### Tightening the Security with Rotating Refresh Tokens

- Since refresh tokens can be stolen, what if we rotate refresh tokens upon every refresh request.
- This means that a refresh token also becomes invalid after 30 minutes and a new token takes its place on the client side.

#### Authorization flow

- The user authenticates with the server,
- The server returns an access token(expires in 30 minutes) and a refresh token(expires in 30 days)
- The client can keep using the access token for 30 minutes in its requests.
- If the access token has expired, the client makes a request to the server for another access token with the existing refresh token.
- The server returns a new access token and a new refresh token.
- The client can keep using the new access token for 30 minutes in its request.
- And so on.

#### How does this help during token theft?

We saw two problems with a single access token - we cannot detect theft and we cannot invalidate the token.
Let's see how this can be achieved using rotating refresh tokens.

**Detection of theft and Invalidation**

- The refresh token RT0 is stolen and the access token AT0 is stolen along with it.
- The attacker uses the access token for a while and then makes a request to the server for a new access token.
- The server returns a new access token AT1 and a new refresh token RT1.
- In the meanwhile, or after this, the victim also makes a request to the server for a new access token using the old refresh token RT0.
- This is when the server can detect that the refresh token is stolen. The server will invalidate all refresh tokens corresponding to that session.
- This means that both the victim and the attacker will have to re-authenticate.

**Forcing a refresh**

- In the above flow, the attacker can still use the access token for a while before refreshing. To solve this, let's force the attacker to refresh access token as soon as it is stolen.
- To do this, we can use the old IP tracking method.
- While creating the token, we can store the IP address of the user's device in it.
- Whenever, we receive a request from the user, we can check if the IP address of request is same as the IP address in the token.
- If the IP is different, as in case of the attacker, we can ask the client to refresh the access token.
- This will force the attacker to refresh the access token as soon as it is stolen and further minimize the time window for the attacker to use the stolen access token.

_Wait a minute!_ Didn't we say IP tracking is inefficient? - Yes! But we can still use it.

Let's talk about the inefficiencies that were stopping us before:

- False positives were leading to less security - If the application cannot detect the change in IP address or somehow the attacker is able to send the same IP as the victim, it is still a problem, but this is less likely, and we have already made the problem smaller by reducing the expiry time of the access token.
- False negatives were making the user log-in again - If the application detects a change in IP when it shouldn't have, it will ask the client to refresh the access token. This is not a problem now because this can happen automatically now.

#### How does this improve the process?

**UX improves**

- Session time remains the same - If earlier we had a 30-day valid access token, we will change it to a 30-min valid access token and a 30-day valid refresh token. This means that the user still does not need to log in for 30 days.
- Now, it is also possible to provide user a list of their active devices or to ask them to review their log-in activity. The library does not directly provide this functionality but contains APIs to help you do so.

**Scalability almost remains the same**

- Although refresh tokens are stored on the server side, they are at max checked once per 30 minutes per user session. This is a negligible deterioration in application throughput.

**Security improves**

Now let's analyze if the security problems of the access token is resolved.

- Shorter expiry means the attacker cannot use the JWT for a long time.
- Detection - We can now detect theft using rotating refresh tokens as described above.
- Invalidation - In a single JWT system, invalidation was not possible per user or per session. However, now each user session has its own refresh token. We can revoke a single session on demand without affecting any other sessions.

---
