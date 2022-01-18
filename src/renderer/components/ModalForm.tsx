import { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Modal,
  Button,
  TextField,
  Grid,
  Alert,
} from '@mui/material';

interface IModalFormProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const boxStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
};

const alertStyle = { marginTop: 4 };

const textfieldPLaceholder = 'Hi Andrey,\n\nI have an issue with ...';

const ModalForm = ({ open, setOpen }: IModalFormProps) => {
  const [modalTextField, setModaltextfield] = useState({
    text: '',
    helper: '',
    error: false,
    disabled: false,
  });
  const [status, setStatus] = useState<boolean | null>(null);

  const handleModalTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = (e.target as HTMLInputElement).value;
    setModaltextfield({
      ...modalTextField,
      text: currentValue,
      helper: '',
      error: false,
    });
  };

  const handleClose = useCallback(() => {
    setOpen(false);
    setStatus(null);
    setModaltextfield({
      ...modalTextField,
      text: '',
      disabled: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (modalTextField.text) {
      setModaltextfield({
        ...modalTextField,
        disabled: true,
      });
      try {
        const { ok } = await window.electronAPI.notifyDeveloper({
          body: modalTextField.text,
          subject:
            'MarketEye Desktop App: Report-a-Problem form has been submitted',
        });
        setStatus(ok);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    } else {
      setModaltextfield({
        ...modalTextField,
        helper: 'Empty message cannot be submitted',
        error: true,
      });
    }
  };

  useEffect(() => {
    setTimeout(handleClose, 6000);
  }, [status, handleClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={boxStyle}>
        <Grid
          container
          justifyContent="center"
          alignContent="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Report a Problem
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Please, describe the issues you have experienced with the{' '}
              <i>MarketEye desktop app</i> by submitting the below form:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleModalTextFieldChange}
              value={modalTextField.text}
              sx={{ mt: 2 }}
              fullWidth
              placeholder={textfieldPLaceholder}
              multiline
              rows={8}
              helperText={modalTextField.helper}
              error={modalTextField.error}
              disabled={modalTextField.disabled}
            />
          </Grid>
          <Grid
            item
            container
            justifyContent="space-evenly"
            alignItems="center"
            xs={12}
            direction="row"
          >
            <Grid item>
              <Button
                onClick={handleSubmit}
                variant="contained"
                style={{ width: 150 }}
                disabled={modalTextField.disabled}
              >
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button
                onClick={handleClose}
                variant="outlined"
                color="error"
                style={{ width: 150 }}
                disabled={modalTextField.disabled}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Grid>
        {status === null ? (
          <></>
        ) : (
          <div>
            {status === true ? (
              <Alert severity="success" sx={alertStyle}>
                Message has been sent successfully!
              </Alert>
            ) : (
              <Alert severity="error" sx={alertStyle}>
                Sorry, something went wrong. Please, contact developer.
              </Alert>
            )}
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default ModalForm;
