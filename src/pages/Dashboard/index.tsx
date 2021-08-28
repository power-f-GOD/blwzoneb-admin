/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthContext, SearchContext } from 'src/App.Contexts';
import { Box } from 'src/components';
import { Http } from 'src/utils';
import DashboardAppBar from './AppBar';
import DashboardDrawer from './Drawer';
import DashboardVirtualizedTable from './VirtualizedTable';

const Dashboard = () => {
  const { authenticated, status: authStatus } = useContext(AuthContext);
  const {
    data: _searchData,
    setSearch,
    statusText: searchStatusText,
    query: searchQuery,
    status: searchStatus
  } = useContext(SearchContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  //eslint-disable-next-line
  const searchData = useMemo(() => _searchData, [_searchData?.length]);

  const handleDrawerToggle = useCallback(() => {
    setDrawerOpen(!drawerOpen);
  }, [drawerOpen]);

  const tableColumns = useMemo(
    () =>
      Object.keys(searchData![0] || {})
        .filter((key) => !/^_?(id|_v)/.test(key))
        .map((key) => ({
          width: /name|email/.test(key)
            ? 600
            : /date|chapter|designation/.test(key)
            ? 500
            : /phone/.test(key)
            ? 400
            : 350,
          label: (key + `${key === 'date' ? ' Registered' : ''}`).replace('_', ' '),
          dataKey: key.toLowerCase(),
          numeric: false
        })),
    // eslint-disable-next-line
    [searchData?.length]
  );

  const rowGetter = useCallback(
    ({ index }) => {
      return {
        ...(searchData![index] || {}),
        date:
          new Date(searchData?.[index].date || 0).toDateString() +
          ' @ ' +
          new Date(searchData?.[index].date || 0).toTimeString().replace(/\s.+/, '')
      };
    },
    [searchData]
  );

  useEffect(() => {
    if (localStorage.getItem('access') && searchStatusText !== 'cache') {
      setSearch({
        data: JSON.parse(localStorage.getItem('registrants') || '[]'),
        statusText: 'cache'
      });
      Http.token = localStorage.getItem('access');
    }
  }, [authStatus, searchStatusText, setSearch]);

  if (!authenticated) {
    return <Redirect to="/auth" />;
  }

  return (
    <Box className="Dashboard anim__fadeIn">
      <DashboardAppBar handleDrawerToggle={handleDrawerToggle} />
      <DashboardDrawer handleDrawerToggle={handleDrawerToggle} drawerOpen={drawerOpen} />
      <Box as="main" className={searchStatus === 'pending' ? 'searching' : ''}>
        <Box as="h5" className="mt-1 text-overflow-ellipsis">
          {searchData?.length
            ? `${searchData?.length} members have registered
          ${searchQuery ? 'in "' + searchQuery + '"' : ''}`
            : `Found no data for "${searchQuery}"`}
        </Box>
        <Box className="searching-indicator">Searching...</Box>
        <DashboardVirtualizedTable
          columns={tableColumns}
          rowCount={searchData?.length || 0}
          rowGetter={rowGetter}
        />
      </Box>
    </Box>
  );
};

export default memo(Dashboard);
