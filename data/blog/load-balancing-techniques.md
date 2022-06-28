---
title: 'Load Balancing Techniques'
date: '2022-01-21'
tags: ['architecture', 'algorithms', 'programming']
draft: false
summary: 'A comparison of load balancing algorithms'
image: '/static/images/article-images/load-balancing.png'
---

<TOCInline toc={props.toc} asDisclosure='true'/>

## What is a load balancer?

Load balancers are typically used to distribute traffic across multiple servers to improve performance.

The servers in the pool are called nodes.
A load balancer is a server that is used to distribute traffic to the nodes in the pool.

**Note** - This article is written with the perspective of server-side load balancing. The details may be slightly different for client-side load balancing.

## How does a typical load balancer work?

1. The load balancer receives a request from the client.
2. The load balancer forwards the request to a server capable of handling the request.
3. The server processes the request and sends the response back to the load balancer.
4. The load balancer forwards the response back to the client.

**Note**: "Capable of handling the request" - There could be multiple servers capable of handling the request. There could also be unhealthy servers which are down. The load balancer needs to know which servers are not working fine.

## Algorithms used by load balancers

There are multiple algorithms that can be used to distribute traffic across multiple servers. We will use the analogy of a restaurant to analyze this.

Imagine a restaurant:

1. The manager is the load balancer.
2. Each customer is a request.
3. Each waiter is a server. (Pun intended)

## Static algorithms

These algorithms do not take into account the real time details of the servers. They have a set of predefined rules and act accordingly.

### Round Robin

In round-robin algorithm, the servers are maintained in a list. The load balancer iterates through the list and forwards the request to the next server in the list.

This means that each server is equally likely to receive a request and the load balancer will distribute the traffic equally across all servers. This is the simplest algorithm and is used by most load balancers as the default algorithm.

If the manager were to use round-robin, they only need to maintain a list of waiters and as customers come, the next waiter is chosen from the list.

**Concerns**

1. It assumes that all waiters are equally efficient which is not always true.
2. It assumes that each customer generates equal amount of work which is definitely not true.

Similarly, servers can have different performance and some requests may be heavier than others. This means that it is possible to have a skewed distribution of load. It also means that an unhealthy server will keep receiving requests and will fail slowly.

Let's see another variation of round-robin algorithm.

### Weighted Round Robin

The only difference here is that the servers are weighted.

The manager is told that some waiters are more efficient than others. Now the list also contains the efficiency of each waiter.
For e.g. there are three waiters and their efficiency is in the ratio of 3:4:5 so the manager distributes the traffic to the waiters in the ratio of 3:4:5.

This solves one concern of the round-robin algorithm - the efficiency of the waiters.

When is weighted round-robin used?

- Usually when the hardware is different for each server. This isn't very common.

### IP-Hashing

The rules of IP-Hashing are as follows:

- The load balancer receives the IP address of the client.
- The load balancer uses the IP address to hash the IP address and then modulo the hash value with the number of servers in the pool.
- The load balancer forwards the request to the server with the modulo value.

This can be seen as a partitioning algorithm.
This is particularly useful when you want one client to be sent to the same server always - because the hash will always choose the same server.

If servers maintain some state about the client they have seen before, this can be useful. For e.g., the server can maintain a cache based on request parameters and serve them faster next time.

However, this again has a skewing problem and could be worse than round-robin because some clients may send more requests that others.

**Note**: The hash function doesn't need to be only about IP address. It can use more parameters if needed.

Let's see how this translates to the restaurant analogy.

- The manager decides that all customers with names starting with "A-I" should be sent to the first waiter. "J-R" should be sent to the second waiter and "S-Z" should be sent to the third waiter.
- This means that if I visit the restaurant, I will always be sent to the first waiter.

This could be beneficial for me because it is now possible for the waiter to maintain some information about me like what I like, what I dislike, etc.
Based on this information, the waiter may serve me better the next time.

**What about skewing?**

- What if there are too many customers with names starting with "A-I" and too few with names starting with "J-R" and "S-Z"?
- The first waiter may get exhausted and may not be able to serve with full efficiency.

**When is IP-hashing good?**

- Low application load so that even after skewing, a single server works fine.
- When maintaining state about the client is beneficial.

## Dynamic algorithms

In dynamic algorithms, the load balancer is aware of the load on the servers when it decides which server to send the request to.

### Least Connection

In this algorithm, the load balancer selects the server with the least number of connections.
The load balancer needs to maintain a map of the servers and their number of connections.

In our restaurant analogy, the manager needs to maintain a map of the waiters and the number of customers they are currently serving.
This is harder for the manager now but less painful for the waiters.

This helps in the below way:

1. The waiters could have different efficiency and it won't skew the load on them.
2. The customers may require more time and it won't skew the load on the waiters.

### Improvements over least connection

Further, if we want to make this even better in terms of waiter efficiency, we can use weights. This will be equivalent to having servers of different hardware capacities. This is called **weighted least connection**.
Now the busy-ness of the server will be measured using the formula - (number of connections of the server) / (weight of the server).

**Can there still be a problem?**

- Only in extreme scenarios. If a server is faulty or failing slowly, it will hold connections longer than it should.
- In such a case, the load balancer will not be able to make a decision to not send more requests to the faulty server.

If the load balancer somehow had a way to measure real time efficiency of the server, this could be used to improve the algorithm.

There could be many metrics. One of them is the number of requests served by the server in a given time period - also known as the **average response time**.

This is often used in conjunction with weighted least connection where the server with the lowest average response time is selected.

In our restaurant analogy, the manager simply keeps track of how many customers each waiter has served in a given time period.

I'm not sure if managers would do that on paper but a good manager always knows which of the waiters needs a break. And as for load balancers, it is possible for load balancers to give servers a break if they perform below a certain threshold.

---

This is probably getting a little out of hand now. If we go beyond this, we are going to need a manager with a Mathematics degree. So that's it for now.

Stay tuned for more on system design. I also write about Java Design patterns, a beginner's series on Golang and occasional articles on other topics. Follow me for more.
If you want to connect with me, you can find me on Twitter [@abh1navv](https://twitter.com/abh1navv).
