/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { createContext, memo, useCallback, useMemo, useState, FC, useEffect } from 'react';

import { AppSnackbarProps, AuthProps, SearchProps } from 'src/types';

export const SnackbarContext = createContext<
  AppSnackbarProps & { setSnackbar: (state?: AppSnackbarProps) => void }
>({
  message: '',
  open: false,
  severity: 'info',
  duration: 1000,
  setSnackbar: () => void 0
});

export const AuthContext = createContext<AuthProps & { setAuth: (state?: AuthProps) => void }>({
  status: 'settled',
  authenticated: false,
  err: false,
  statusText: '',
  setAuth: () => void 0
});

export const SearchContext = createContext<
  SearchProps & { setSearch: (state?: SearchProps) => void }
>({
  status: 'settled',
  err: false,
  statusText: '',
  data: [],
  query: '',
  setSearch: () => void 0
});

export const AppWindowContext = createContext<number>(globalThis.innerWidth);

const AppContextsProvider: FC<any> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [snackbar, setSnackbarState] = useState<AppSnackbarProps>({
    open: false,
    severity: 'info',
    message: ''
  });
  const [auth, setAuthState] = useState<AuthProps>({
    status: 'settled',
    authenticated: false,
    err: false
  });
  const [search, setSearchState] = useState<SearchProps>({
    status: 'settled',
    statusText: '',
    err: false,
    data: [],
    query: ''
  });

  const setAuth = useCallback((state?: AuthProps) => {
    setAuthState((prev) => ({ ...prev, ...(state || {}) }));
  }, []);

  const setSnackbar = useCallback((state?: AppSnackbarProps) => {
    setSnackbarState((prev) => ({ ...prev, ...(state || {}) }));
  }, []);

  const setSearch = useCallback((state?: SearchProps) => {
    setSearchState((prev) => ({ ...prev, ...(state || {}) }));
  }, []);

  const snackbarContextValue = useMemo(
    () => ({ ...snackbar, setSnackbar }),
    [snackbar, setSnackbar]
  );
  const authContextValue = useMemo(() => ({ ...auth, setAuth }), [auth, setAuth]);
  const searchContextValue = useMemo(() => ({ ...search, setSearch }), [search, setSearch]);

  useEffect(() => {
    let _throttle: NodeJS.Timeout;

    window.onresize = () => {
      clearTimeout(_throttle);
      _throttle = setTimeout(() => {
        setWindowWidth(globalThis.innerWidth);
      }, 100);
    };
  }, []);

  return (
    <AppWindowContext.Provider value={windowWidth}>
      <SnackbarContext.Provider value={snackbarContextValue}>
        <AuthContext.Provider value={authContextValue}>
          <SearchContext.Provider value={searchContextValue}>{children}</SearchContext.Provider>
        </AuthContext.Provider>
      </SnackbarContext.Provider>
    </AppWindowContext.Provider>
  );
};

export default memo(AppContextsProvider);
