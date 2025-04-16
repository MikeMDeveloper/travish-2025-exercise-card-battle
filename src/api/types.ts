export type Pokemon = {
  id: string;
  name: string;
  evolves_from: string;
  evolves_to: string;
  species_evolution_chain_ids: string[];
  species_color: string;
  sprites_front_default: string;
  sprites_front_shiny: string;
  sprites_other_showdown_front_default: string;
  sprites_other_showdown_front_shiny: string;
  sprites_other_showdown_back_default: string;
  sprites_other_showdown_back_shiny: string;
  sprites_versions_generation_vii_icons_front_default: string;
  stats_hpTotal: number;
  stats_attack: number;
  stats_defense: number;
  stats_speed: number;
  idKey: string;
  isShiny: boolean;
  stats_hp: number;
};

export type PokemonData = {
  id: string;
  name: string;
  evolves_from: string;
  evolves_to: string;
  species_evolution_chain_ids: string[];
  species_color: string;
  sprites_front_default: string;
  sprites_front_shiny: string;
  sprites_other_showdown_front_default: string;
  sprites_other_showdown_front_shiny: string;
  sprites_other_showdown_back_default: string;
  sprites_other_showdown_back_shiny: string;
  sprites_versions_generation_vii_icons_front_default: string;
  stats_hpTotal: number;
  stats_attack: number;
  stats_defense: number;
  stats_speed: number;
};

export type PokemonDataArray = {
  allPokemonData: PokemonData[];
};

export function copyPokemonDataToPokemon(pokemonData: PokemonData) : Pokemon {
  const newPokemonData = {
    ...pokemonData,
    idKey: pokemonData?.id, // should be modified after this copy
    isShiny: false, // should be modified after this copy
    stats_hp: pokemonData?.stats_hpTotal // should be modified after this copy
  } as Pokemon;
  return newPokemonData;
}

export type PokemonListData = {
  allPokemonData: PokemonData[];
  benchPokemon: Pokemon[];
  activePokemon: Pokemon | null;
  cash: number;
};
