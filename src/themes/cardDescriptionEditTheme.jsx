import { createMuiTheme } from "@material-ui/core/styles";
export const cardDescriptionEditTheme = createMuiTheme({
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
        "& $notchedOutline": {
          borderColor: "white",
          backgroundColor: "rgba(224, 224, 231, 0.3)",
        },
        "&:hover:not($disabled):not($focused):not($error) $notchedOutline": {
          borderColor: "white",
          backgroundColor: "rgba(224, 224, 231, 0.5)",
          // Reset on touch devices, it doesn't add specificity
        },
        "&$focused $notchedOutline": {
          borderColor: "var(--amplify-primary-color)",
        },
      },
      inputMarginDense: {
        paddingTop: "5px",
      },
      input: {
        padding: "6px 2px 0px 7px;",
      },
    },
  },
});
