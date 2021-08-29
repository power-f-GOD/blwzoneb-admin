/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AppBar, IconButton, InputAdornment, TextField, Toolbar } from '@material-ui/core';
import { memo, useCallback, useContext, useState, FC } from 'react';

import { AppWindowContext, SearchContext, SnackbarContext } from 'src/App.Contexts';
import { Box, FAIcon } from 'src/components';
import { SearchProps } from 'src/types';
import { Http, inputProps } from 'src/utils';

const DashboardAppBar: FC<{ handleDrawerToggle: () => void }> = ({ handleDrawerToggle }) => {
  const windowWidth = useContext(AppWindowContext);
  const { setSearch } = useContext(SearchContext);
  const { setSnackbar } = useContext(SnackbarContext);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleSearchClick = useCallback(async () => {
    setSearch({ status: 'pending' });

    try {
      const { data } = await Http.get<SearchProps['data']>(
        `/registrants?q=${searchQuery}&password=${Http.token}`
      );

      if (data) {
        const cachedData = JSON.parse(
          localStorage.getItem('registrants') || '[]'
        ) as SearchProps['data'];

        setSearch({ data, query: searchQuery, status: 'fulfilled' });

        if (data.length > (cachedData?.length || 0)) {
          localStorage.setItem('registrants', JSON.stringify(data));
        }
      }
    } catch (e: any) {
      setSnackbar({
        open: true,
        severity: 'error',
        message:
          'An error occurred!' +
          (!navigator.onLine
            ? " You're probably offline. Kindly check that you have an active internet connection."
            : '')
      });
      setSearch({ status: 'settled', err: true });
    }
  }, [searchQuery, setSearch, setSnackbar]);

  return (
    <AppBar position="fixed" className={'Dashboard__AppBar'}>
      <Toolbar>
        {windowWidth < 768 && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className="me-2">
            <FAIcon name="bars" />
          </IconButton>
        )}
        <Box as="h6" className="d-none d-sm-block me-3 my-3 py-1">
          Dashboard
        </Box>
        <form
          className="ms-auto"
          noValidate
          autoComplete="on"
          onSubmit={(e: any) => {
            e.preventDefault();
            handleSearchClick();
          }}>
          <TextField
            required
            // error={authErr}
            variant="outlined"
            id="password"
            placeholder="Search..."
            size="small"
            autoComplete="search"
            // inputRef={searchRef}
            value={searchQuery}
            type={'search'}
            aria-label="admin search"
            onChange={handleSearchChange}
            inputProps={inputProps}
            className=""
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleSearchClick}>
                    <FAIcon color="white" name="search" />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </form>
      </Toolbar>
    </AppBar>
  );
};

export default memo(DashboardAppBar);
