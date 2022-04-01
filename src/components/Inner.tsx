import React from 'react'
import { useQuery } from 'react-query';

const Inner = () => {
  // useQuery takes 2 things:
  // 1. a name for the query
  // 2. an api
  //    - need to make sure your data arrives as json!
  const queryInfo = useQuery('pokemon', () =>
    fetch('https://pokeapi.co/api/v2/pokemon').then((res) => res.json())
  );

  console.log(queryInfo);

  return (
    <div>Inner</div>
  )
}

export default Inner