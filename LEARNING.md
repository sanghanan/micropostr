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

### Encountered Challenges

#### The N+1 Query Problem

While fetching all posts (1 query), we ended up making additional N queries to fetch comments for each post. This is readily solved in a monolithic architecture by fetching posts with comments in a single query, like `/posts?include=comments`.

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
