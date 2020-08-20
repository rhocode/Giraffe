import React from "react";
import * as Sentry from "@sentry/react";
import { Store } from "pullstate";
import { ErrorBoundary } from "react-error-boundary";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export const errorStore = new Store({
  errorType: null,
});

const useStyles = (theme) => {
  console.log(theme);
  return {
    container: {
      background: "#1D1E20",
      height: "100%",
      width: "100%",
    },
  };
};

// &&
// navigator.userAgent?.indexOf(
//   'Prerender (+https://github.com/prerender/prerender)'
// ) === -1
if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn:
      "https://a1b8cacbf80d4d16afce2fb9cd39db2f@o416463.ingest.sentry.io/5311573",
  });
}

function BlankFallbackComponent() {
  const styles = useStyles();

  return <div className={styles.container} />;
}

function FallbackComponent() {
  const styles = useStyles();

  const errorType = errorStore.useState((s) => s.errorType);

  let title = "Diagnosing...";
  let body = "";
  let action = () => {};
  switch (errorType) {
    case "ChunkLoadError":
      title = "Application Data Missing!";
      body =
        "It looks like you're missing part of the app! Click okay to reload the page and fix it!";
      action = () => {
        window.location.reload();
      };
      break;
    default:
      break;
  }

  return (
    <div className={styles.container}>
      <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {body}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={action} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function componentOnError(error) {
  if (error.name === "ChunkLoadError") {
    errorStore.update((s) => {
      s.errorType = error.name;
    });
  } else {
    throw error;
  }
}

function SGErrorBoundary(props) {
  if (process.env.NODE_ENV !== "production") {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return (
    <Sentry.ErrorBoundary
      fallback={BlankFallbackComponent}
      showDialog
      dialogOptions={{
        title: "Yikes!",
        subtitle: "A lizard doggo probably chewed the cord somewhere.",
        subtitle2:
          "Tell us what happened below and FICSIT engineers will be dispatched to your location for assistance.",
      }}
    >
      <ErrorBoundary
        onError={componentOnError}
        FallbackComponent={FallbackComponent}
      >
        {props.children}
      </ErrorBoundary>
    </Sentry.ErrorBoundary>
  );
}

export default SGErrorBoundary;
