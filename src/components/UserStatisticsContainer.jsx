import { Grid } from "@material-ui/core";
import React, { useState } from "react";

import "./UserStatisticsContainer.css";
const UserStatisticsContainer = () => {
  return (
    <Grid container xs={12} color="black" className="statistics-user-container">
      <Grid container xs={12} className="statistics-user-total-container">
        <Grid item xs={6} className="statistics-user-total-cards">
          Total #
        </Grid>
        <Grid item xs={6} className="statistics-user-total-missed-cards">
          Total missed #
        </Grid>
      </Grid>
      <Grid container xs={12} className="statistics-user-lists-container">
        <Grid container xs={4} className="statistics-user-todo-container">
          Todo
        </Grid>
        <Grid container xs={4} className="statistics-user-doing-container">
          Doing
        </Grid>
        <Grid container xs={4} className="statistics-user-done-container">
          Done
        </Grid>
      </Grid>
    </Grid>
  );
};

export default UserStatisticsContainer;
