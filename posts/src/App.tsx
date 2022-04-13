import { QueryClientProvider, QueryClient, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState } from 'react';
import SinglePost from './components/SinglePost';
import ManyPosts from './components/ManyPosts';

export function Content() {
  const [postId, setPostId] = useState<number>(-1);

  return (
    <>
      {postId > -1 ? (
        <SinglePost postId={postId} setPostId={setPostId} />
      ) : (
        <ManyPosts setPostId={setPostId} />
      )}
    </>
  );
}

export default function App() {
  const queryClient = new QueryClient();

  return (
    <div className='App'>
      <QueryClientProvider client={queryClient}>
        <Content />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}
