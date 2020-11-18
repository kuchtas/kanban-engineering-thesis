import { createMuiTheme } from "@material-ui/core/styles";
export const deleteButtonTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      label: {
        color: "red",
      },
      outlinedPrimary: {
        color: "red",
        border: "red",
        "&:hover": {
          // increase the specificity for the pseudo class
          border: "red",
        },
      },
    },
  },
});
