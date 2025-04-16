import styled from "styled-components";
import { Pokemon } from "../api/types";

const BenchCardContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  width: 150px;
  height: 180px;
  border-radius: 16px;
  border-width: 2px;
  border-style: solid;
  text-align: center;
  margin: 8px;
`;

type PokemonBenchCardProps = {
  idKey: string;
  playerBench: Pokemon[];
  onUpgradeClick: (idKey: string) => void;
  onBattleClick: (idKey: string) => void;
  isGameOver: boolean;
};

export const PokemonBenchCard = ({ idKey, playerBench, onUpgradeClick, onBattleClick, isGameOver }: PokemonBenchCardProps) => {
  const thisPokemon = playerBench.find((item) => item.idKey === idKey);
  const isFullyEvolved = thisPokemon?.stats_hp === thisPokemon?.stats_hpTotal && thisPokemon?.evolves_to === "none";

  return (
    <BenchCardContainer style={{ borderColor: thisPokemon?.species_color, color: thisPokemon?.isShiny ? "purple" : "black" }}>
      {thisPokemon && (
        <>
          <div>{thisPokemon.name} {thisPokemon.stats_hp} HP</div>
          <img alt="pokemon" width="96" height="96" style={{ transform: "scaleX(-1)" }} src={thisPokemon.isShiny ? thisPokemon.sprites_front_shiny : thisPokemon.sprites_front_default} />
          {!isFullyEvolved && (
            <button style={{ background: thisPokemon.species_color }} onClick={() => {
              onUpgradeClick(thisPokemon.idKey);
            }}>Train me!</button>
          )}
          {isFullyEvolved && (
            <button style={{ background: thisPokemon.species_color, color: "black" }}>Fully Trained!</button>
          )}
          {<button style={{ background: thisPokemon.species_color, color: isGameOver ? "black" : "white" }} onClick={() => {
              onBattleClick(thisPokemon.idKey);
            }}>Send to Battle!</button>
          }
        </>
      )}
    </BenchCardContainer>
  );
};
