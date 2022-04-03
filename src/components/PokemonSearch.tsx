import axios from 'axios';
import { useState } from 'react';
import { useQuery } from 'react-query';
import PokemonInfo from '../types/PokemonInfo';

const PokemonSearch = () => {
  const [pokemon, setPokemon] = useState<string>('');

  return (
    <>
      <input value={pokemon} onChange={(e) => setPokemon(e.target.value)} />
      <br />
      <PokemonSearchResults pokemon={pokemon} />
    </>
  );
};

export default PokemonSearch;

const PokemonSearchResults = ({ pokemon }: { pokemon: string }) => {
  // should probably debounce this
  const queryInfo = useQuery<PokemonInfo>(`${pokemon}`, async () => {
    return axios
      .get(`http://pokeapi.co/api/v2/pokemon/${pokemon}`)
      .then((res) => res.data);
  });

  if (queryInfo.isError) return <div>Error</div>;
  if (queryInfo.isFetching) return <div>Fetching</div>;
  if (!queryInfo.data?.sprites?.front_default)
    return <div>Pokemon '{pokemon}' not found</div>;
  return <img src={queryInfo.data.sprites.front_default} alt={pokemon} />;
};
