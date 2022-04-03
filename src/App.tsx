import './App.css';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Berries from './components/Berries';
import Pokemon from './components/Pokemon';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Pokemon />
      <Berries />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
