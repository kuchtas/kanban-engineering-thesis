import { createMuiTheme } from "@material-ui/core/styles";
export const deleteTextFieldTheme = createMuiTheme({
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
          borderColor: "red",
          // Reset on touch devices, it doesn't add specificity
        },
        "&$focused $notchedOutline": {
          borderColor: "red",
        },
      },
    },
  },
});
