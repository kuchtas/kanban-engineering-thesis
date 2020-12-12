import { createMuiTheme } from "@material-ui/core/styles";
export const tagUserStatisticsSelectTheme = createMuiTheme({
  overrides: {
    MuiSelect: {
      select: {
        paddingTop: "0px",
        paddingBottom: "0px",
      },
    },
  },
});
