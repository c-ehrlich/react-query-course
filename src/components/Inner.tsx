import axios from 'axios';
import { useQuery } from 'react-query';

type PokemonListType = {
  name: string;
  url: string;
};

const Inner = () => {
  // useQuery takes 2 things:
  // 1. a name for the query
  // 2. an api
  //    - need to make sure your data arrives as json!
  const queryInfo = useQuery<PokemonListType[]>('pokemon', async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return axios
      .get('https://pokeapi.co/api/v2/pokemon')
      .then((res) => res.data.results);
  });

  console.log(queryInfo);

  if (queryInfo.isLoading) return <div>'Loading...'</div>;

  if (queryInfo.isError) return <div>'Error'</div>;

  return (
    <div>
      {queryInfo.data!.map((result) => {
        return <div key={result.name}>{result.name}</div>;
      })}
    </div>
  );
};

export default Inner;
