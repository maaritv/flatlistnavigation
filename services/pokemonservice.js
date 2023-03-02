/**
 * Note that this does not contain try - catch block, because
 * we want to throw the error to calling function, so that 
 * user will be aware of it.
 */

/**
 * Note the version number in url
 */

export const getPokemonsFromApiAsync = async () => {
    const response = await fetch(
        'https://pokeapi.co/api/v2/pokemon'
      );
      const json = await response.json();
      return json.results;
  };