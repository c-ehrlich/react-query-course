import usePokemon from '../hooks/usePokemon';

const Count = () => {
  const queryInfo = usePokemon();

  return <h3>You are looking at {queryInfo.data?.length} Pokemon</h3>;
};

export default Count;
