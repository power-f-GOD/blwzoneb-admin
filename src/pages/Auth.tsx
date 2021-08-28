/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRef, useCallback, memo, useContext, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';

import { Http, inputProps } from 'src/utils';
import { Box, FAIcon } from 'src/components';
import { AuthContext, SnackbarContext } from 'src/App.Contexts';

const passwordRef = createRef<HTMLInputElement>();
const formRef = createRef<HTMLFormElement>();

const Auth = () => {
  const {
    status: authStatus,
    err: authErr,
    statusText: authStatusText,
    authenticated,
    setAuth
  } = useContext(AuthContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const isLoading = authStatus === 'pending';
  const isAuthenticated = authenticated || !!localStorage.getItem('access');

  const authenticate = useCallback(async () => {
    try {
      const { data, message } = await Http.get(`/registrants?q=&password=${password}`, false);

      Http.token = password;
      setSnackbar({
        severity: data ? 'success' : 'info',
        open: true,
        message: data ? 'Welcome, Highly Esteemed!' : message
      });
      setAuth({ err: !data, status: 'fulfilled', statusText: message, authenticated: !!data });

      if (localStorage && data) {
        localStorage.setItem('access', password);
        localStorage.setItem('registrants', JSON.stringify(data));
      }
    } catch (e: any) {
      setSnackbar({
        severity: 'error',
        open: true,
        message: !navigator.onLine
          ? "You're offline."
          : /fetch|network|connect/i.test(e.message)
          ? 'A network error occurred. Please, check that you have an active internet connection.'
          : e.message
      });
      setAuth({ status: 'settled', err: true });
    }
  }, [password, setAuth, setSnackbar]);

  const handleAuthenticationRequest = useCallback(() => {
    setAuth({ status: 'pending' });
    authenticate();
  }, [authenticate, setAuth]);

  const handlePasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value);

      if (authErr) {
        setAuth({ err: false });
      }
    },
    [authErr, setAuth]
  );

  const handlePasswordVisibilityClick = useCallback(
    () => setPasswordVisible((visible) => !visible),
    []
  );

  useEffect(() => {
    if (!authenticated) {
      setAuth({ authenticated: isAuthenticated });
    }
  }, [authenticated, isAuthenticated, setAuth]);

  if (isAuthenticated) {
    return <Redirect to="/" />;
  }

  return (
    <Box className="App anim__fadeIn">
      <Container className="min-vh-100 pt-4">
        <h1 className="text-center mb-4 px-2 h4">BLW Zone B</h1>
        <form
          className="d-flex justify-content-center mt-5 pt-5 flex-column slide-in-bottom"
          noValidate
          autoComplete="on"
          onSubmit={(e: any) => e.preventDefault()}
          ref={formRef}>
          <h2 className="text-center mb-5 mt-4 px-2">Administrator</h2>
          <Row className="align-self-center px-3">
            <Col xs={12} className="text-field-container">
              <TextField
                required
                error={authErr}
                variant="outlined"
                id="password"
                label="Admin Password"
                size="small"
                autoComplete="current-password"
                inputRef={passwordRef}
                value={password}
                type={passwordVisible ? 'text' : 'password'}
                helperText={authErr ? authStatusText : ' '}
                aria-label="admin password"
                fullWidth
                onChange={handlePasswordChange}
                inputProps={inputProps}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handlePasswordVisibilityClick}>
                        <FAIcon color="white" name={passwordVisible ? 'eye-slash' : 'eye'} />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Col>

            <Col xs={12} className="text-field-container button-wrapper">
              <Button
                variant="contained"
                size="large"
                disabled={isLoading || !password?.trim()}
                id="sign-up"
                className="major-button"
                type="submit"
                color="primary"
                fullWidth
                onClick={handleAuthenticationRequest}
                aria-label="submit">
                {isLoading ? (
                  <>
                    Authenticating...{' '}
                    <CircularProgress color="inherit" size={16} className="ms-2" thickness={4} />
                  </>
                ) : (
                  <>
                    Access <FAIcon name="paper-plane" className="ms-2" />
                  </>
                )}
              </Button>
            </Col>
          </Row>
        </form>
      </Container>
    </Box>
  );
};

export default memo(Auth);
