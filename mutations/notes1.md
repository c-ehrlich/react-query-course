# Mutations
## Queries vs Mutations
Queries:
- Retrieve
Mutations:
- Create
- Update
- Delete

## useMutation
- lets us replace a createPost function that uses axios, with something better that gives us more information
- pass it an async function
- it returns two things in an array...
  - 1. the actual mutation function (call this inside JSX or whatever)
  - 2. some information about the mutation
```jsx
const [createPost, createPostInfo] = createPostuseMutation((values) => {
  axios.post('/api/posts', values), {
    // make the postList refresh immediately after a new post is created
    onSuccess: () => {
      // actually we probably want this to run all the time, even if there is an error
      // queryCache.invalidateQueries('posts');
    },
    onError: (error) => {
      window.alert(error.response);
    },
    onSettled: () => {
      queryCache.invalidateQueries('posts');
    }
  };
})
```

## createPostInfo has information about the mutation in it
what can we do with it: Dynamic button labels example
```jsx
<button>{
  createPostInfo.isLoading 
    ? 'Saving...' 
    : createPostInto.isError 
    ? 'Error' : CreatePostInfo.isSuccess 
    ? 'Saved!' 
    : 'Create Post'
  }
</button>
```

## Mutation side effects
Example: let's say we can't use bad words in post titles => server returns 400, that info ends up in isError
But we probably want more... tell the user what happened
- use `onError`
  - the axios error object has `error.response`
    - `error.response.data.message`: 'You cannot use bad words in titles!'
In form...
```jsx
{createPostInfo.isError
  ? (<pre>{createPostInfo.error.response.data.message}</pre>)
  : null
}
```

## Updating query data with mutation responses
Example of an update post page with optimistic refetching
```jsx
export default function Post() {
  const { query: { postId }, } = useRouter(); // get id from url

  const postQuery = useQuery(['post', postId], () =>
    axios.get(`/api/posts/${postId}`).then((res) => res.data)
  )

  const [savePost, savePostInfo] = useMutation((values) =>
    axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data), {
      // optimistic refetching
      // data is the data that comes back as the response of the mutation
      // values are the values that were passed originally to the mutation function
      onSuccess: (data, values) => {
        // simple version that requires us to refetch the data, even though it's in the 'data' of onSuccess
        // queryCache.invalidateQueries(['post', String(values.id)])

        // More complex version where we don't need to fetch again...
        console.log(data);
        // TKTK probably use the queryClient for this in r-q 3
        queryCache.setQueryData(['post', String(values.id)], data);
        // still do this anway afterwards, just in case
        // setting manually is the 'optimistic' part, so we still 'pessimistically' make sure we're up to date with the server, just in case
        queryCache.invalidateQueries(['post', String(values.id)])
      }
    }
  )

  return (
    <div>post info, form, button</div>
    // submit button has same savePostInfo.isXXX based text as before
  )
}
```

- `setQueryData` lets us write directly to the query data... useful eg for putting stuff from a response back into the query
- This is dangerous, so we either (1) need to be 100% sure that the data matches what's on the server or (2) follow up the optimistic manual write with an invalidation so that we get the right data sooner or later

## Optimistic Updates for list-like queries
- When we create a new post, we don't really need to wait for a server response to add it to the list, because we just created it...
  - We can just use the same data that we sent to the server
  - (obviously it's not guaranteed that the server will actually create a new post from that data)
- 'Optimistic update' ... trying as hard as we can to show users asap what we think they're going to see, before they can actually see it for real

```jsx
const [createPost, createPostInfo] = useMutation(
  (values) => axios.post('/api/posts', values),
  {
    // triggers when we trigger the mutation (ie click the post button)
    // has the same values as the createPost function
    onMutate: (values) => {
      // this is probably in the queryClient now...
      // can use a function `oldData => newData`
      // which we need because otherwise we don't have access to all the existing posts
      queryCache.setQueryData('posts', oldPosts => {
        return [
          ...oldPosts,
          {
            ...values
            id: Date.now(), // we know this will change, but whatever
          }
        ]
      })
    },
    onError: (error) => { window.alert(error.response.data.message) },
    onSettled: () => queryCache.invalidateQueries('posts'),
  }
)
```

## Rollbacks for list-like queries
- We automatically fix stuff by invalidating queries, but we can also do it earlier
- Example: we create a post with a Bad Word title, server sends back a 400... we don't need to wait until we've refetched to know that the post should not be there
  
- How to go back to the list without the 'Bad Word' post in it?
  - basic: manually remove it
  - good solution: rollback
    - snapshot data before optimistic update

```jsx
const [createPost, createPostInfo] = useMutation(
  (values) => axios.post('/api/posts', values),
  {
    onMutate: (values) => {
      // make sure we're not currently fetching to avoid race conditions
      queryCache.cancelQueries('posts');

      const oldPosts = queryCache.getQueryData('posts');

      queryCache.setQueryData('posts', /* TKTK set it (same as above) */)

      // this will be available in onError as the 3rd arg
      // v1... have to do it manually in onError
      // return rollback;
      // v2... return a rollback function
      return () => queryCache.setQueryData('posts', oldPosts);
    },
    onError: (error, values, rollback) => {
      // queryCache.setQueryData('posts', rollback)
      if (rollback) rollback();
    }
  }
)
```

## Optimistic updates + rollbacks for single entity queries
```jsx
export default function Post() {
  const { query: { postId }, } = useRouter(); // get postId from url

  const postQuery = useQuery(['post', postId], () =>
    axios.get(`/api/posts/${postId}`).then((res) => res.data);
  )

  const [savePost, savePostInfo] = useMutation(
    (values) => axios.patch(`/api/posts/${values.id}`, values).then((res) => res.data),
    {
      onMutate: (values) => {
        queryCache.cancelQueries(['post', String(values.id)]);

        const oldPost = queryCache.getQueryData(['post', String(values.id)]);

        queryCache.setQueryData(['post', String(values.id)], values);

        return () => queryCache.setQueryData(['post', String(values.id)], oldPost);
      },
      onSuccess: (data, values) => {
        queryCache.setQueryData(['post', String(values.id)], data);
      },
      onError: (error, values, rollback) => {
        if (rollback) rollback();
      },
      onSettled: (data, error, values) => {
        queryCache.invalidateQueries(['post', String(values.id)]);
      }
    }
  )

  return (<div>post, field to edit title, submit button</div>)
}
```

## Working with complex / nested objects
- see: https://github.com/tannerlinsley/react-query/discussions/1500
