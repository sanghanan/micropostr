# Implementing Microservices

This document reflects on my journey on implementing a distributed, microservice-oriented architecture. 

## Initial Implementation Approach

I started by creating a system composed of three distinct microservices, each with a dedicated repository:

1. **Client Service**: A React application serving as the user interface. It allows users to create and view posts and comments. This service acts as a conduit between the user and the other two services, deployed on separate ports. It utilizes Axios for making HTTP requests to the other services and aggregates the resulting data.

2. **Posts Service**: This service is responsible for managing post data. It offers two primary endpoints:
   - `POST /posts`: To create a new post.
   - `GET /posts`: To retrieve all posts.
   
   The posts are stored in-memory using a simple object structure keyed by the post ID.

    ```json
    {
        "25ac475a": {
            "id": "25ac475a",
            "content": "First Post!"
        }
    }
    ```

3. **Comments Service**: Similar to the Posts Service, but for comments. It provides endpoints for creating and retrieving comments associated with a specific post.
   - `POST /posts/:postId/comments`: Create a new comment on a post.
   - `GET /posts/:postId/comments`: Retrieve all comments for a specific post.
   
   Comments are stored in a keyed object structure, where the key is the post ID to which the comments belong.

    ```json
    {
        "25ac475a": {
            "id": "37bc475e",
            "content": "First Comment!"
        }
    }
    ```

### Problems

The first roadblock: The N+1 Query Problem. While fetching all posts (1 query), I ended up making additional N queries to fetch comments for each post. This is easily solved in a monolithic architecture by fetching posts with comments in a single query, like `/posts?include=comments`.

Addressing this in a microservice architecture requires more thought. One solution is to introduce a composite service that can consolidate data from the Posts and Comments Services into a single response, something like this:

```json
{
    "25ac475a": {
        "id": "25ac475a",
        "content": "First Post!",
        "comments": [
            {
                "id": "37bc475e",
                "content": "First Comment!"
            }
        ]
    }
}
```


## Optimizing Microservices Communication with an Event Bus

To address the inefficiencies encountered with the N+1 problem in our microservices architecture, I adopted an event-driven approach. This involved the implementation of an event bus, a pattern that facilitates communication between services in a decoupled manner. Here’s how I refined the process:

### Event Bus Integration

I introduced an event bus to our ecosystem, enabling services to communicate indirectly through events. Whenever a post or comment is created, the respective service publishes an event to the event bus with the following structure:

```json
{
    "type": "PostCreated",
    "data": {
        "id": "25ac475a",
        "content": "First Post"
    }
}
```

This event-driven approach allows for loose coupling between services. While I implemented a simple version for demonstration, in practice, utilizing robust messaging systems like Kafka or RabbitMQ would enhance manageability and scalability.

### Query Service: Aggregating Data

To consolidate data from multiple services and eliminate the N+1 query issue, I use a **Query Service**. This service listens for events published on the event bus, such as `PostCreated` and `CommentCreated`, and updates its internal state accordingly. Here's an example of how data is structured within the Query Service:

```json
{
    "25ac475a": {
        "id": "25ac475a",
        "content": "First Post!",
        "comments": [
            {
                "id": "37bc475e",
                "content": "First Comment!"
            }
        ]
    }
}
```

The Query Service maintains a denormalized, read-optimized view of the data, combining posts and their associated comments into a single structure. This approach significantly reduces the complexity and number of requests needed to fetch posts with comments.

### Accessing Combined Data

To fetch posts along with their comments, clients now make a single request to the Query Service:

- `GET /posts`

This endpoint provides a consolidated view of posts and comments, effectively resolving the N+1 query problem by reducing the need for multiple round-trips between services.

### Problems

This architecture should scale well, and it is very decoupled. However, an important consideration is state consistency. Missed data and duplicated data and real problems with this approach.