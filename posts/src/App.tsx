import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import axios from 'axios';
import existingUser from './existingUser';

// we need the userId before we can query for the user object
// user email: 'Sincere@april.biz';
const email: string = 'Sincere@april.biz';

function MyPosts() {
  const userQuery = useQuery(
    'user',
    () =>
      axios
        .get(`https://jsonplaceholder.typicode.com/users?email=${email}`)
        .then((res) => res.data[0]),
    {
      // we have access to this before the react query request even starts
      // avoid first loading state
      // this is super powerful
      initialData: existingUser,
    }
  );

  const postsQuery = useQuery(
    'posts',
    () =>
      axios
        .get(
          `https://jsonplaceholder.typicode.com/posts?useId=${userQuery.data.id}`
        )
        .then((res) => res.data),
    {
      // only run when this condition is met
      enabled: Boolean(userQuery?.data?.id),
    }
  );

  if (userQuery.isLoading) return <div>Loading user...</div>;
  if (userQuery.data && userQuery.data.id)
    return (
      <div>
        <pre>{JSON.stringify(userQuery.data, null, 2)}</pre>
        <br />
        {postsQuery.isIdle ? null : postsQuery.isLoading ? (
          'Loading posts...'
        ) : (
          <div>Post count: {postsQuery.data?.length}</div>
        )}
      </div>
    );
  return <div>help</div>;
}

export default function App() {
  const queryClient = new QueryClient();
  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <MyPosts />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}
