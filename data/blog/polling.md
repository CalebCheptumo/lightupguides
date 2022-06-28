---
title: 'Implementing HTTP Polling'
date: '2021-12-05'
tags: ['java', 'architecture', 'javascript']
draft: false
summary: 'Introduction to Http polling and an implementation example'
image: '/static/images/article-images/java-records.jpg'
---

## Polling

Polling is a technique for making requests in a non-blocking manner. It is particularly useful for applications that need to make requests to services which take a long time to process the request.

Let's say we have a client and a server. If the client makes a synchronous request, its thread will block until the server responds. For a long process at the server, this can be problematic. In a real-world application accessed by lots of users, this would lead to reduced ability of the application to serve new requests.

For e.g. if the capacity of the client is to hold 100 requests at a time and the server takes a few minutes to process a single request, this can lead to a situation where the client is unable to serve new requests because there are no free threads.

To solve this, we need to make the client asynchronous. Polling is one of the techniques which can be used to achieve this.

This is **how polling works in a nutshell**:

1. The client makes a request to the server just like a simple HTTP request.
2. The server responds to the client but has not finished processing the request.
3. The client polls the server after some interval to see if the request has been processed.
4. If the request has been processed, the client receives the response.
5. If not, the client polls again after some interval.

**NOTE:** Keep in mind that the client here can be a server in itself, like in a microservice architecture. It can also be a frontend application. I will talk about this towards the end of this article.

Now let's discuss some steps in detail.

### The initial processing and response

The server receives the request and does the bare minimum processing before sending the response back to the client.

Minimum processing would look like:

1. Check if the request is **authorized** - whichever authentication mechanism is used.
2. Check if the request is **valid** - contains all the required parameters. Additionally, the server can check if the request can be converted to a domain object.

These checks make sure the request is "processable". Any **client side errors** (4xx) like Bad request, unauthorized, etc. are returned to the client at this stage itself.

#### What should the response contain?

1. The status of the request - Preferably **202 Accepted**. This is to indicate that the request has been received and is being processed.
2. The **status endpoint** to be used for polling.
3. Any of the two urls will need to contain **a unique id for the request**. We have a few options:
   - The id of the request - Assuming every request had a unique id.
   - The id of the resource which is being created - if the request is a create request. For e.g. if the processing results in creating a new resource, the server needs to create a token corresponding to the resource and send it back to the client.
   - Basically anything that uniquely identifies the request. This is open to implementation decisions.
4. The **polling interval** - The time interval between two successive polls. This is optional from the server end. The client can also choose the interval. However, it is recommended that the server chooses the interval.

When the polling is done with the unique id, the status endpoint should be able to use the id to check the status of the request.

### The status endpoint

The status endpoint is a **GET** request to the server. It is used to check the status of the request.
It contains a unique id for the request usually appended to the path. E.g. _/status/id_

#### Status calls

The status endpoint is called periodically by the client to check the status of the request.

What happens when if the request passes, fails or is still in progress has a few different ways to be handled. I recommend always treating the status endpoint in a RESTful manner. Which means whether the request has passed, failed or is still in progress, the status endpoint should return a **200 OK** status with the appropriate response in the body.

Let's see an example of a status endpoint.

```yaml
paths:
   - /status/{id}
      get:
         summary: Get the status of a request
         operationId: getStatus
         responses:
            '200':
               description: The status of the request
               content:
                  application/json:
                     schema:
                        $ref: '#/components/schemas/Status'
            '401':
               description: The status request is unauthorized
               content:
                  application/json:
                     schema:
                        $ref: '#/components/schemas/Error'
            '404':
               description: The status request is not found
               content:
                  application/json:
                     schema:
                        $ref: '#/components/schemas/Error'
definitions:
   Status:
      type: object
      properties:
         status:
            type: string
            description: The status of the request
            enum:
               - Passed
               - Failed
               - InProgress
         url:
            type: string
            description: The url of the final resource
         message:
            type: string
            description: The message corresponding to the status
            enum:
               - Request passed
               - Request failed
               - Request still in progress
         nextPoll:
            type: integer
            description: The time in seconds to wait before polling again
            format: int64
   Error:
      type: object
      properties:
         error:
            type: string
            description: The error message
            enum:
               - Invalid request
               - Unauthorized request
```

If you're not familiar with OpenAPI, you can read more about it [here](https://swagger.io/docs/specification/open-api-specification/).

In that case only focus on the status object. It contains:

- the status of the request,
- the url of the final resource,
- the message corresponding to the status and
- the time in seconds to wait before polling again.

### When to use HTTP polling

There can be a number of reasons to use HTTP polling and a number of reasons not to.
It is an old way of doing things and it is not recommended when a superior way is available.

Other popular ways of doing asynchronous requests are:

1. WebSockets or Webhooks for responses.
2. Queue-based communication.

But for both of these approaches, the client should be a backend server in itself. Moreover, the original server should be able to communicate with the client using the return protocol.

- So naturally, for frontend applications (websites, apps, desktop clients, etc) , HTTP polling is a valid option.
- It is also a valid option when the server cannot fire back HTTP requests to its clients due to network/security restrictions. We cannot use webhooks in this scenario.
- Sometimes, the server runs legacy code and it cannot communicate with the client using the latest protocols.

## Let's implement a simple HTTP polling example

Imagine a use case where you have a frontend application that needs to make an HTTP request to a backend server. The server will take a long time to process the request so HTTP polling is a good option.
The client is a javascript function running in a browser.

The original request is to create a new user. If the request is successful, a 202 response is returned along with the status endpoint and the next polling time in response.

Let's see the client code for this:

```javascript
function createUser(name, email, password) {
  const url = 'http://localhost:8080/users'
  const body = {
    name,
    email,
    password,
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }
  return fetch(url, options)
    .then((response) => {
      if (response.status === 202) {
        return response.json()
      } else {
        return response.json().then((error) => {
          throw new Error(error.message)
        })
      }
    })
    .then((response) => {
      const statusUrl = response.statusUrl
      const nextPoll = response.nextPoll
      return pollStatus(statusUrl, nextPoll)
    })
}
```

Now let's look at the server code in Spring Boot for this request. It sends an immediate response and executes the request in a separate thread. It also saves the request id in the database.

```java
@RestController
public class UserController {

   @Autowired
   private UserService userService;

   @Autowired
   private RequestService requestService;

   private static final long POLL_INTERVAL = 1000;

   @PostMapping("/users")
   public ResponseEntity<User> createUser(@Valid @RequestBody User user) {
      String requestId = new UUID.randomUUID().toString();
      requestService.save(new Request(requestId, "PENDING"));
      userService.createUser(user);
      return new ResponseEntity<>(createResponse(createStatusUrl(requestId), POLL_INTERVAL), HttpStatus.ACCEPTED);
   }
}
```

I am not covering security and validation here.
These concerns are handled by Spring boot before the request reaches the controller if

1. Spring Security is configured.
2. Bean Validation is enabled.

The internal details of request service are also not important for this example. The important part is that the status url is created using the request id.

```java
@Service
public class UserService {

   @Autowired
   private UserRepository userRepository;

   @Async
   public void createUser(User user) {
      userRepository.save(user);
   }
}
```

Note that the `@Async` annotation is used to execute the request in a separate thread.

Now let's look at the pollStatus function. It is a recursive function that polls the status endpoint and returns the response on completed, failed or error state is returned.

```javascript
function pollStatus(statusUrl, nextPoll) {
  return fetch(statusUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.json()
      } else {
        return response.json().then((error) => {
          throw new Error(error.message)
        })
      }
    })
    .then((response) => {
      if (response.status === 'COMPLETED' || response.status === 'FAILED') {
        return response.result
      } else {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(pollStatus(statusUrl, nextPoll))
          }, nextPoll * 1000)
        })
      }
    })
}
```

The function need not be recursive. You can use a simple while loop to poll the status endpoint with a timeout.

Now let's look at the server code for the status request.

```java
@RestController
public class StatusController {

   @Autowired
   private RequestService requestService;

   @GetMapping("/status")
   public ResponseEntity<StatusResponse> getStatus(@RequestParam String id) {
      RequestStatus requestStatus = requestService.getRequestStatus(id);
      if (requestStatus == null) {
         return new ResponseEntity<>(HttpStatus.NOT_FOUND);
      } else {
         return new ResponseEntity<>(new StatusResponse(requestStatus), HttpStatus.OK);
      }
   }
}
```

Again not covering security here. If a request corresponding to the id is not found, a 404 response is returned otherwise a 200 response is returned along with the status.

---

Thanks for reading! This should give you an idea about HTTP Polling. If you find any issues with the code, please let me know. Javascript is not my first language so please forgive me if I am not clear.
If you want to connect with me, you can find me on Twitter [@abh1navv](https://twitter.com/abh1navv).
