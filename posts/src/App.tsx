import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import SinglePost from './components/SinglePost';
import ManyPosts from './components/ManyPosts';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export function Content() {
  return (
    <Routes>
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/" element={<ManyPosts />} />
    </Routes>
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
