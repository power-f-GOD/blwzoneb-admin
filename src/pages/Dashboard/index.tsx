/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';

import { AuthContext, SearchContext } from 'src/App.Contexts';
import { Box } from 'src/components';
import { ColumnData } from 'src/types';
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

  const tableColumns: ColumnData[] = [
    {
      width: 175,
      label: 'S/N',
      dataKey: 'index',
      numeric: true
    }
  ];

  Object.keys(searchData![0] || {})
    .filter((key) => !/^_?(id|_v)/.test(key))
    .map((key) => {
      const data = {
        width: /name|email/.test(key)
          ? 700
          : /date|chapter|designation/.test(key)
          ? 650
          : /phone|zone/.test(key)
          ? 400
          : 300,
        label: (key + `${key === 'date' ? ' Registered' : ''}`).replace('_', ' '),
        dataKey: key.toLowerCase(),
        numeric: false
      };

      switch (true) {
        case /^title/.test(data.label):
          tableColumns[1] = data;
          break;
        case /^full/.test(data.label):
          tableColumns[2] = data;
          break;
        case /^designation/.test(data.label):
          tableColumns[3] = data;
          break;
        case /^chapter/.test(data.label):
          tableColumns[4] = data;
          break;
        case /^zone/.test(data.label):
          tableColumns[5] = data;
          break;
        case /^phone/.test(data.label):
          tableColumns[6] = data;
          break;
        case /^email/.test(data.label):
          tableColumns[7] = data;
          break;
        default:
          tableColumns.push(data);
          break;
      }
    });

  const rowGetter = useCallback(
    ({ index }) => {
      return {
        ...(searchData![index] || {}),
        index: Math.abs((searchData?.length || 0) - index),
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
          `
            : `Found no data for "${searchQuery}"`}
          {searchQuery && searchData?.length ? (
            <>
              in {' "'}
              <Box as="span" className="text-uppercase">
                {searchQuery + '"'}
              </Box>
            </>
          ) : (
            ''
          )}
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
