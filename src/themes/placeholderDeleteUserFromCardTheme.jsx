import { createMuiTheme } from "@material-ui/core/styles";
export const placeholderDeleteUserFromCardTheme = createMuiTheme({
  overrides: {
    MuiButton: {
      label: {
        color: "transparent",
      },
      outlinedPrimary: {
        color: "transparent",
        border: "transparent",
        "&:hover": {
          // increase the specificity for the pseudo class
          border: "transparent",
        },
      },
    },
  },
});
