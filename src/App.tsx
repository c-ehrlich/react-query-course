import './App.css';

import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Inner from './components/Inner';

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Inner />
    </QueryClientProvider>
  );
}

export default App;
