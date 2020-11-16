// CSS
import "./InvalidUserError.css";

const InvalidUserError = ({ history }) => {
  return (
    <div className="invalid-user-container">
      <p
        className="invalid-user-home-link"
        onClick={() => history.push("/home")}
      >
        It looks like you are not a part of this board! Click here to create
        your own board.
      </p>
    </div>
  );
};

export default InvalidUserError;
