import {
    Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function CloseModal(props: any) {
  const { closeModalOpen, handleClose, exitAction } = props;

  return (
    <Dialog
      open={closeModalOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to quit the lesson?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          All current progress will be lost
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ display: "flex" }}>
        <Button onClick={handleClose} className="me-auto">
          Cancel
        </Button>
        <Button color="error" onClick={exitAction} autoFocus>
          Continue exit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CloseModal;
