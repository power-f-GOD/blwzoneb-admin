/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useContext } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { SnackbarContext } from 'src/App.Contexts';

const AppSnackbar = () => {
  const { setSnackbar, ...snackbar } = useContext(SnackbarContext);

  const handleCloseSnackbar = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar({ open: false });
  };

  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      onClose={handleCloseSnackbar}>
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={snackbar.severity}
        onClose={handleCloseSnackbar}>
        {snackbar.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default memo(AppSnackbar);
