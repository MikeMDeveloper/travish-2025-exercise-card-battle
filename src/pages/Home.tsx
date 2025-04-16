type HomePageProps = {
    onBenchClick: () => void;
};

export const HomePage = ({ onBenchClick }: HomePageProps) => {
  return (
    <>
      <img width="79" height="45" src="https://assets.pokemon.com/assets/cms2/img/misc/gus/buttons/logo-pokemon-79x45.png"></img>
      <h1>Pokémon Battle Game</h1>
      <h2>Train your Pokémon then go to Battle!</h2>
      <br/>
      <button style={{ background: "#3B4CCA", color: "#FFDE00" }} onClick={() => onBenchClick()}>Let's Play!</button>
    </>
  );
};
