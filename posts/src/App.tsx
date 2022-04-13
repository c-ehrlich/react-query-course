import { QueryClientProvider, QueryClient, useQueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import SinglePost from './components/SinglePost';
import ManyPosts from './components/ManyPosts';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useReducer } from 'react';

export function Content() {
  const [show, toggle] = useReducer((d) => !d, true);
  const queryClient = useQueryClient();

  return (
    <>
      <button onClick={toggle}>{show ? 'hide' : 'show'}</button>
      <button onClick={() => queryClient.invalidateQueries('posts', {
        // just marks the query as stale instead of immediately refetching
        refetchActive: false,
        // refetch even if the data is not currently being used
        refetchInactive: true,
      })}>Invalidate</button>
      {show ? (
        <Routes>
          <Route path='/post/:id' element={<SinglePost />} />
          <Route path='/' element={<ManyPosts />} />
        </Routes>
      ) : null}
    </>
  );
}

export default function App() {
  const queryClient = new QueryClient();

  return (
    <div className='App'>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Content />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}
