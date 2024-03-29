import React, { useEffect, useState } from "react";
import { MyButton, MyModal, SingleCard, Countdown } from "../../components";
import "./GamePage.scss";
import { useCountdown } from "../../hooks/useCountdown";

const cardImages = [
  { id: 1, src: "/img/book.png", matched: false },
  { id: 2, src: "/img/bunny.png", matched: false },
  { id: 3, src: "/img/hat.png", matched: false },
  { id: 4, src: "/img/magic-ball.png", matched: false },
  { id: 5, src: "/img/rainbow-castle.png", matched: false },
  { id: 6, src: "/img/smoke.png", matched: false },
];

const GamePage = (props) => {
  const {
    nameValue,
    startGame,
    setStartGame,
    gameMode,
    setNameValue,
    setGameMode,
  } = props;
  const [cards, setCards] = useState();
  const [turns, setTurns] = useState(0);
  const [isFirstCardSelected, setIsFirstCardSelected] = useState(null);
  const [isSecondCardSelected, setIsSecondCardSelected] = useState(null);
  const [isCardFlipDisabled, setIsCardFlipDisabled] = useState(false);
  const [isModalActive, setIsModalActive] = useState(false);
  const [isGameLosed, setIsGameLosed] = useState();
  const initialTime = 60;

  const {
    countdown,
    isCountdownActive,
    timer,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useCountdown(initialTime);

  // shuffle cards
  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));
    setCards(shuffledCards);
  };

  const startNewGame = () => {
    startTimer();
    shuffleCards();
    setIsFirstCardSelected(null);
    setIsSecondCardSelected(null);
    setTurns(0);
    setIsModalActive(false);
  };

  const restartGame = () => {
    resetTimer();
    startNewGame();
  };

  const backToWelcomePage = () => {
    setIsModalActive(false);
    setStartGame(false);
    resetTimer();
    setGameMode();
    setNameValue("New Player");
  };

  //handle a choice
  const handleCardChoice = (card) => {
    isFirstCardSelected
      ? setIsSecondCardSelected(card)
      : setIsFirstCardSelected(card);
  };

  // win
  const isGameFinished = () => {
    const allCardsMatched = cards?.every((element) => element.matched === true);
    if (allCardsMatched === true) {
      setTimeout(() => setIsModalActive(true), 500);
      setIsGameLosed(false);
      pauseTimer();
    }
  };

  // start a new game automatically
  useEffect(() => {
    startNewGame();
  }, []);

  // compare 2 selected cards
  useEffect(() => {
    if (isFirstCardSelected && isSecondCardSelected) {
      setIsCardFlipDisabled(true);
      if (isFirstCardSelected.src === isSecondCardSelected.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === isFirstCardSelected.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [isFirstCardSelected, isSecondCardSelected]);

  useEffect(() => {
    isGameFinished();
  }, [cards]);

  // lose
  const gameLoseByTurns = () => {
    if (gameMode === 2 && turns >= 20) {
      setIsGameLosed(true);
      setTimeout(() => setIsModalActive(true), 500);
    }
  };

  const gameLoseByTime = () => {
    if (!isCountdownActive && countdown === 0) {
      setTimeout(() => setIsModalActive(true), 500);
      setIsGameLosed(true);
    }
  };

  useEffect(() => {
    gameLoseByTurns();
  });

  useEffect(() => {
    gameLoseByTime();
  });

  // reset choices & increase turn
  const resetTurn = () => {
    setIsFirstCardSelected(null);
    setIsSecondCardSelected(null);
    setTurns((prevTurns) => prevTurns + 1);
    setIsCardFlipDisabled(false);
  };

  return (
    <div className="App">
      <MyModal
        isModalActive={isModalActive}
        setIsModalActive={setIsModalActive}
        startGame={startGame}
        setStartGame={setStartGame}
        shuffleCards={shuffleCards}
        restartGame={restartGame}
        turns={turns}
        backToWelcomePage={backToWelcomePage}
        gameMode={gameMode}
        isGameLosed={isGameLosed}
      />

      <h2>Hi, {nameValue}</h2>
      <MyButton clickButton={restartGame}>Restart game</MyButton>
      <MyButton clickButton={backToWelcomePage}>Exit</MyButton>

      {gameMode === 1 ? <Countdown timer={timer} /> : <></>}
      {gameMode === 2 ? <p>Turns: {turns}/20</p> : <></>}

      {gameMode === 3 ? <p>Turns: {turns}</p> : <></>}

      <div className="card-grid">
        {cards?.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleCardChoice={handleCardChoice}
            flipped={
              card === isFirstCardSelected ||
              card === isSecondCardSelected ||
              card.matched
            }
            isCardFlipDisabled={isCardFlipDisabled}
          />
        ))}
      </div>
    </div>
  );
};

export { GamePage };
