import { ReactQueryDevtools } from 'react-query/devtools';
import { usePaginatedQuery, QueryClientProvider, QueryClient } from 'react-query';
import axios from 'axios';
import React, { useState } from 'react';

// usePaginatedQuery:
// as the key changes from page to page, keep the old data
function Posts() {
  const [page, setPage] = useState(0);
  
  // need to use a complex query key that changes when the page changes
  const postsQuery = usePaginatedQuery(['posts', { page }], () =>
    axios
      .get('https://jsonplaceholder.typicode.com/posts', {
        params: {
          pageSize: 10,
          pageOffset: page,
        }
      })
      .then((res) => res.data)
  );

  return (
    <div>
      {postsQuery.isLoading ? (
        <span>Loading...</span>
      ) : (
        <>
          <h3>Posts {postsQuery.isFetching ? <small>...</small> : null}</h3>
          <ul>
            {/* 
             * have postsQuery.resolvedData and postsQuery.latestData
             * resolvedData is the last thing that fully resolved
             * once the latest query resolves, it becomes resolvedData
             */}
            {postsQuery.resolvedData.items.map((post) => (
              <li key={post.id}>{post.title}</li>
            ))}
          </ul>
        </>
      )}
      <button onClick={() => setPage(old => old - 1)} disabled={page === 0}>Previous</button>
      <button onClick={() => setPage(old => old + 1)} disabled={!postsQuery.latestData?.nextPageOffset}>Next</button>
      <span>Current page: { page + 1 } {postsQuery.isFetching ? '...' : ''}</span>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <Posts />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
