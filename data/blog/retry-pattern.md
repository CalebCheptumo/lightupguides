---
title: 'Retry Pattern in Microservices'
date: '2022-02-25'
tags: ['microservices', 'cloud', 'architecture']
draft: false
summary: 'Introduction to the Retry pattern in Microservices'
image: '/static/images/article-images/retry-pattern.png'
---

![Retry Pattern in Microservices](/static/images/article-images/retry-pattern.png)

In a microservices architecture, the retry pattern is a common pattern for recovering from transient errors.

Some examples of these errors are:

**Network failure**

An application lost connectivity for a short period of time.

**Component failure**

A component is unavailable for a short period of time. This usually happens during maintenance or automatic recovery from a crash.

**Component overload**

A component is overloaded and cannot accept new requests for a short period of time. This could also be due to a throttling or rate-limiting implementation.

As you can see, **the above errors are self-healing**. In this case, it makes sense for the client to retry the request (immediately or after a delay) rather than logging the error and aborting the request.

## Retry Pattern

Retry patterns can be implemented in a number of ways. However, each implementation needs to take care of the below considerations:

### Identifying Transient Errors

The first important step is to identify if the error is transient or not. This will let us decide if the request needs to be repeated or the error should be logged.

For example, a connection timeout indicates a network error and should be retried.
On the other hand, an authentication failure isn't going to go away after a few seconds and should not be retried.

### Retry Delay

The second important step is to decide how long to wait before retrying the request.

For real-time tasks like web page request, the delay should be as short as possible, retries should be less, and errors may provide better experience than delayed retries. However, for long-running or background tasks like sending an email notification, the delay should be long enough to allow the system to recover.

Let's discuss more about delay timings.

### Backoff Time

Backoff time is the time to wait before retrying the request. The backoff time is calculated based on the number of retries and the delay between retries.
This can be used to avoid flooding the system with retries.

It can be broadly classified into these categories:

#### Constant/0 backoff time

The backoff time is the same for all retries. This is **good for rare network failures or low load services**.

#### Incremental backoff time

The backoff time is **calculated based on the number of retries**. Some examples of incremental backoff time are linear, exponential, and fibonacci. Exponential is the most common where the time doubles every time the retried request fails.

#### Random backoff time

The backoff time is calculated randomly between the minimum and maximum backoff time or through a more complex function which is guaranteed to produce random delays. This is **useful for avoiding thundering herd problems** - in short, if a large number of requests hit at the same time and this is the reason for the failure, it won't help if their retries also hit at the same time. Randomness in retry delays will avoid this.

## Implementing a Retry Pattern

A simple retry implementation will consist of the below steps:

1. Identify transient conditions - E.g. which response codes, errors or network exceptions indicate a transient error.
2. Decide backoff time and algorithm - as described above.
3. Decide maximum number of retries.
4. While retry count is less than the maximum count, retry the request until the request succeeds.
5. If retries are exhausted, log the error and abort the request.

### Existing implementations

Before implementing our own retry pattern, we can leverage existing implementations. Let's see where we can look for existing implementations:

- **Clients and SDKs**. There are many existing solutions for retrying requests. Depending on the service you are calling, the retry functionality may already be implemented. For example, the Apache Kafka client provides retry functionality using the `retry` configuration option. Similarly, a large number of popular cloud SDKs already provide retry functionality.
- **Language and tool support**. The retry pattern is a common pattern in many languages and tools. For example, the Python `requests` library provides retry functionality.
- **Framework-specific libraries**. The retry pattern is a common pattern in many libraries. For example, in Spring applications, Spring Retry and Resilience4J are popular retry libraries.

---

Thanks for reading! This should give you an idea of Retry Patterns. If you want to connect with me, you can find me on [Twitter](https://twitter.com/abh1navv).
