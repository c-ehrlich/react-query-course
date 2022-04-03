import './App.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Berries from './components/Berries';
import Pokemon from './components/Pokemon';
import PokemonSearch from './components/PokemonSearch';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PokemonSearch />
      <Pokemon />
      <Berries />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
