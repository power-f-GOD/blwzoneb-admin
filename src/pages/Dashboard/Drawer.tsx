/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Button, Drawer } from '@material-ui/core';
import { memo, useContext, useMemo, FC, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import { AppWindowContext, AuthContext, SnackbarContext } from 'src/App.Contexts';
import { Box, FAIcon } from 'src/components';
import { Http } from 'src/utils';

const DashboardDrawer: FC<{ handleDrawerToggle: () => void; drawerOpen: boolean }> = ({
  handleDrawerToggle,
  drawerOpen
}) => {
  const { setAuth } = useContext(AuthContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const windowWidth = useContext(AppWindowContext);
  const paperClassName = useMemo(
    () => ({
      paper: 'Dashboard__Drawer'
    }),
    []
  );

  const handleSignout = useCallback(() => {
    Http.token = null;
    delete localStorage.access;
    setAuth({ status: 'settled', authenticated: false, err: false });
    setSnackbar({
      severity: 'info',
      open: true,
      message: 'Have a wonderful day!'
    });
  }, [setAuth, setSnackbar]);

  const children = (
    <>
      <Box as="h6">
        Events <FAIcon name="calendar-alt" className="ms-2" />
      </Box>
      <NavLink to="/">TIE Conf 2021</NavLink>
      <Button onClick={handleSignout} color="secondary" variant="outlined" className="mt-auto">
        Sign out <FAIcon name="sign-out-alt" className="ms-2" />
      </Button>
    </>
  );

  return (
    <Box as="nav" className={'Dashboard__Nav'} aria-label="dashboard nav">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      {windowWidth < 768 ? (
        <Drawer
          container={document.body}
          variant="temporary"
          anchor={'left'}
          open={drawerOpen}
          onClick={handleDrawerToggle}
          classes={paperClassName}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}>
          {children}
        </Drawer>
      ) : (
        <Drawer classes={paperClassName} variant="permanent" open>
          {children}
        </Drawer>
      )}
    </Box>
  );
};

export default memo(DashboardDrawer);
