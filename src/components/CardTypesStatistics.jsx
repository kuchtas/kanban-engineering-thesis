import { Grid } from "@material-ui/core";
import { useState, useEffect } from "react";
import "../styles/CardTypesStatistics.css";
import StatisticsCard from "./StatisticsCard";
const CardTypesStatistics = ({ cards, done = false }) => {
  const [whiteCards, setWhiteCards] = useState([]);
  const [greenCards, setGreenCards] = useState([]);
  const [yellowCards, setYellowCards] = useState([]);
  const [orangeCards, setOrangeCards] = useState([]);
  const [redCards, setRedCards] = useState([]);
  const [blackCards, setBlackCards] = useState([]);

  useEffect(() => {
    const newWhiteCards = done
      ? cards.filter((card) => card.points[0] === "deadline-term-0")
      : cards.filter((card) => card.timeLeftGroup === "deadline-term-0");
    setWhiteCards(newWhiteCards);

    const newGreenCards = done
      ? cards.filter((card) => card.points[0] === "deadline-term-1")
      : cards.filter((card) => card.timeLeftGroup === "deadline-term-1");
    setGreenCards(newGreenCards);

    const newYellowCards = done
      ? cards.filter((card) => card.points[0] === "deadline-term-2")
      : cards.filter((card) => card.timeLeftGroup === "deadline-term-2");
    setYellowCards(newYellowCards);

    const newOrangeCards = done
      ? cards.filter((card) => card.points[0] === "deadline-term-3")
      : cards.filter((card) => card.timeLeftGroup === "deadline-term-3");
    setOrangeCards(newOrangeCards);

    const newRedCards = done
      ? cards.filter((card) => card.points[0] === "deadline-term-4")
      : cards.filter((card) => card.timeLeftGroup === "deadline-term-4");
    setRedCards(newRedCards);

    const newBlackCards = done
      ? cards.filter((card) => card.points[0] === "deadline-term-5")
      : cards.filter((card) => card.timeLeftGroup === "deadline-term-5");
    setBlackCards(newBlackCards);
  }, [cards]);
  return (
    <>
      <Grid item xs={12} className="statistics-card-type-item">
        <StatisticsCard
          cardNumber={whiteCards.length}
          totalCards={cards.length}
          term={(done ? "done-" : "") + "deadline-term-0"}
        />
      </Grid>
      <Grid item xs={12} className="statistics-card-type-item">
        <StatisticsCard
          cardNumber={greenCards.length}
          totalCards={cards.length}
          term={(done ? "done-" : "") + "deadline-term-1"}
        />
      </Grid>
      <Grid item xs={12} className="statistics-card-type-item">
        <StatisticsCard
          cardNumber={yellowCards.length}
          totalCards={cards.length}
          term={(done ? "done-" : "") + "deadline-term-2"}
        />
      </Grid>
      <Grid item xs={12} className="statistics-card-type-item">
        <StatisticsCard
          cardNumber={orangeCards.length}
          totalCards={cards.length}
          term={(done ? "done-" : "") + "deadline-term-3"}
        />
      </Grid>
      <Grid item xs={12} className="statistics-card-type-item">
        <StatisticsCard
          cardNumber={redCards.length}
          totalCards={cards.length}
          term={(done ? "done-" : "") + "deadline-term-4"}
        />
      </Grid>
      <Grid item xs={12} className="statistics-card-type-item">
        <StatisticsCard
          cardNumber={blackCards.length}
          totalCards={cards.length}
          term={(done ? "done-" : "") + "deadline-term-5"}
        />
      </Grid>
    </>
  );
};

export default CardTypesStatistics;
