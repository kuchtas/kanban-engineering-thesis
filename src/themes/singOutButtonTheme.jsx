import { createMuiTheme } from "@material-ui/core/styles";
export const signOutButtonTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      label: {
        color: "white",
      },
    },
  },
});
