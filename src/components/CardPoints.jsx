import { FormGroup, FormControlLabel, Checkbox } from "@material-ui/core";
import React, { useState } from "react";
import { Point } from "../models/index";
import { DataStore } from "@aws-amplify/datastore";

const CardPoints = () => {
  const [points, setPoints] = useState([]);
  const loadPoints = async () => {
    // const pointsQuery = await DataStore.query(Point, (p) =>
    //   p.cardID("eq", match.params.id).status("eq", "DONE")
    // );
  };

  return (
    <FormGroup>
      {points.map((point) => {
        return (
          <>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Point 1"
            />
          </>
        );
      })}
    </FormGroup>
  );
};

export default CardPoints;
