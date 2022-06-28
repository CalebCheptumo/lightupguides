---
title: 'Top tools to learn to become a complete Java developer'
date: '2021-10-04'
tags: ['java']
draft: false
summary: 'Top tools to learn to become a complete Java developer'
image: '/static/images/article-images/java-records.jpg'
---

Once you have enough grasp of Core Java, it is important to go beyond the basics and learn how to solve real problems.

Here is a list of tools that will help you on your path as a Java developer.

<TOCInline toc={props.toc} asDisclosure='true'/>

### Unit testing

Unit testing is a widely adopted practice and is a must-have skill for Java developers

**Tools**

- Junit -the underlying default framework for unit testing
- Mockito/PowerMock- built on top of JUnit to make things easier and enable testing of complex scenarios

![thumb_so-you-are-telling-me-thati-have-towrite-code-to-62019358.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1633269298981/T_vqceaft.png)

### Calling other Web Services

It's highly likely that you will need to call web services (APIs) from the Internet or your own internal services.

- JAX-WS/JAX-RS - for simple requests and for understanding the fundamentals
- Apache HttpClient - for rich features

### Logging

In actual applications, it is recommended to maintain log files for easy analysis

- SLF4J - abstraction which provides the logging API - what you will use in code
- Log4J - one of the implementations of SLF4J - configurable and takes care of things in the backend

### Work with Databases

You need to interact with databases of all kinds.

**Relational Data**

- JDBC - a driver to connect with DBs and execute queries
- JPA - abstract API to map data between databases and Java Objects
- Hibernate - an implementation of JPA for relational DBs

**Non-relational Databases**

- Each non-relational DB may provide its own driver and library
- Some non-relational DBs are also supported by implementations of latest versions of JPA. For e.g. MongoDB and Neo4J

![harold-wrong-database-selected-8388409-rows-affected.jpeg](https://cdn.hashnode.com/res/hashnode/image/upload/v1633269342714/EuxocH-eR.jpeg)

### Working with JSONs

JSON is the most popular data transfer format across languages and frameworks. Operations with JSON like serialization/deserialization (converting from Java Object to JSON and vice-versa) is a common use case.

- Jackson is the best choice. In fact, it is the most popular Java library.
- Gson is another popular option

### Dependency management and build tools

Any Java application will depend on multiple libraries outside the Java standard library.

To manage these dependencies and to package your application into an executable file, build tools

**Tools**

- Maven
- Gradle

![oh-look-maven-is-downloading-the-internet.jpeg](https://cdn.hashnode.com/res/hashnode/image/upload/v1633269428577/QFggty-PL.jpeg)

### Working with an IDE

It's hard to develop Java applications using a text editor and a terminal (not impossible though)

To increase your productivity and speed and to make common tasks simpler, it is good to be familiar with an IDE of your choice.
**Most popular options**

- IntelliJ
- Eclipse

![ide-me-code-suggestion-thanks-ide-im-nothing-without-you-59130116.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1633269450664/43ctABRHo.png)

### Containers

Java had very less containerization need to begin with but its Write Once Run Anywhere capability has been enhanced by the latest developments in containerization technologies.

Using Docker with Java applications is easy and a great skill to have.

### General Purpose libraries

- There are two widely used general purpose libraries which make all of our Core Java tasks easier and help with some of the activities listed above.

Don't learn these separately. Just use them in your applications.

- Apache Commons
- Guava

### Building websites and APIs with Spring and SpringBoot

Saved the best for the last. Spring is the most popular Java framework.

It helps with almost everything you will need and makes each and every task easier.

Its common use case is for building APIs which makes it the de-facto standard for building microservices

Another use case is building websites.

Spring uses the model-view-controller pattern

1. Model - define and work with Data Model
2. View - plug-in a frontend framework to create and return web pages
3. Controller - entrypoint for page or API requests

Another development around Spring was the introduction of Spring Boot - A framework to bootstrap Spring projects and to provide easier configuration.

With Spring Boot, you can save yourself a lot of boilerplate work and focus on the core of your development.

### Other honorable mentions

1. Apache Commons Codec - basic crypto operations
2. JMS/RabbitMQ/Kafka - messaging between applications
3. Move on to Kotlin for Android development
4. JAX-B - working with XML
5. Internationalization - to create multilingual websites

Most of these tools have a small learning curve. Maven/Gradle, Unit testing and Spring will need some extra effort and you will get better with practice.

If you're new to all of them, I recommend starting with Spring at the center and connecting the dots with others.

Thanks for sticking with me for so long. I hope this gives you a path to follow to become an efficient Java developer.

---

Find ways to connect with me at http://bio.link/abh1navv
