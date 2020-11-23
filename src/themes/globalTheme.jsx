import { createMuiTheme } from "@material-ui/core/styles";

export const globalTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#479dff",
    },
  },
  overrides: {
    MuiInputLabel: {
      // Name of the component ⚛️ / style sheet
      root: {
        // Name of the rule
        "&$focused": {
          // increase the specificity for the pseudo class
          color: "var(--amplify-primary-color)",
        },
      },
    },
    MuiOutlinedInput: {
      root: {
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: "var(--amplify-primary-color)",
          // Reset on touch devices, it doesn't add specificity
        },
        "&$focused $notchedOutline": {
          borderColor: "var(--amplify-primary-color)",
        },
      },
    },
    MuiButton: {
      label: {
        color: "var(--amplify-primary-color)",
      },
      outlinedPrimary: {
        color: "var(--amplify-primary-color)",
        border: "1px solid var(--amplify-primary-color)",
        "&:hover": {
          // increase the specificity for the pseudo class
          border: "1px solid var(--amplify-primary-color)",
        },
      },
    },
    MuiChip: {
      label: {
        paddingRight: "4px !important",
        paddingLeft: "4px !important",
      },
    },
  },
});
