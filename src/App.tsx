import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import Inner from './components/Inner';
import { ReactQueryDevtools } from 'react-query/devtools';

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Inner />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
