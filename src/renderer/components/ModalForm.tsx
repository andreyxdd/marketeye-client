import { useState } from 'react';
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

const alertStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
};

const textfieldPLaceholder = 'Hi Andrey,\n\nI have an issue with ...';

const ModalForm = ({ open, setOpen }: IModalFormProps) => {
  const [modalTextField, setModaltextfield] = useState<string>('');
  const [status, setStatus] = useState<boolean | null>(null);

  const handleModalTextFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const currentValue = (e.target as HTMLInputElement).value;
    setModaltextfield(currentValue);
  };

  const handleClose = () => {
    setOpen(false);
    setStatus(null);
    setModaltextfield('');
  };

  const handleReport = async () => {
    try {
      const { ok } = await window.electronAPI.notifyDeveloper({
        email_body: modalTextField,
      });
      setStatus(ok);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {status === null ? (
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
                value={modalTextField}
                sx={{ mt: 2 }}
                fullWidth
                placeholder={textfieldPLaceholder}
                multiline
                rows={8}
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
                  onClick={handleReport}
                  variant="contained"
                  style={{ width: 150 }}
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
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <div>
          {status === true ? (
            <Alert severity="success" sx={alertStyle}>
              Message have been sent successfully!
            </Alert>
          ) : (
            <Alert severity="error" sx={alertStyle}>
              Sorry, something went wrong ... Please, contact developer.
            </Alert>
          )}
        </div>
      )}
    </Modal>
  );
};

export default ModalForm;
