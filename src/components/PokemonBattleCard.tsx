import { Pokemon } from "../api/types";

type BattleCardProps = {
  playerBattlePokemon: Pokemon;
  scaleX: number;
};

// w148 x h140 is largest showdown dimensions

export const PokemonBattleCard = ({ playerBattlePokemon, scaleX }: BattleCardProps) => {
  const thisPokemon = playerBattlePokemon;
  const scaleXValue = "scaleX(" + scaleX + ")";
  const healthBarPercentage = Math.floor((thisPokemon.stats_hp / thisPokemon.stats_hpTotal) * 100);

  return (
    <>
      {thisPokemon && (
        <table>
          <tbody>
            <tr style={{ height:160, verticalAlign: "bottom" }}>
              <td><img style={{ transform: scaleXValue }} src={thisPokemon.isShiny ? thisPokemon.sprites_other_showdown_front_shiny : thisPokemon.sprites_other_showdown_front_default} /></td>
            </tr>
            <tr style={{ height:20, color: thisPokemon?.isShiny ? "purple" : "black" }}>
              <td>{thisPokemon.name} {thisPokemon.stats_hp} HP</td>
            </tr>
            <tr>
              <td>
                <div style={{ borderRadius: '3px', border: '1px solid black', width: '100%', height:10 }} >
                  <div style={{ backgroundColor: thisPokemon.species_color, width: `${healthBarPercentage}%`, height:10 }} >
                    &nbsp;
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </>
  );
};
