/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { TableCell, Paper } from '@material-ui/core';
import { FC, memo, useCallback } from 'react';
import { AutoSizer, Column, Table, TableCellRenderer, TableHeaderProps } from 'react-virtualized';

import { DashboardVirtualizedTableProps } from 'src/types';

const headerHeight = 48;
const rowHeight = 48;

const DashboardVirtualizedTable: FC<DashboardVirtualizedTableProps> = (props) => {
  const { columns } = props;
  const headerRenderer = useCallback(
    ({ label, columnIndex }: TableHeaderProps & { columnIndex: number }) => {
      return (
        <TableCell
          component="div"
          // className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
          variant="head"
          style={{ height: headerHeight }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}>
          <span>{label}</span>
        </TableCell>
      );
    },
    [columns]
  );

  const cellRenderer: TableCellRenderer = useCallback(
    ({ cellData, columnIndex }) => {
      return (
        <TableCell
          component="div"
          className=""
          variant="body"
          style={{ height: rowHeight }}
          align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}>
          {cellData}
        </TableCell>
      );
    },
    [columns]
  );

  const headerRendererCallback = useCallback(
    (index) => (headerProps: TableHeaderProps) =>
      headerRenderer({
        ...headerProps,
        columnIndex: index
      }),
    [headerRenderer]
  );

  const handleRenderData = useCallback(
    ({ dataKey, ...other }, index) => {
      return (
        <Column
          key={dataKey}
          headerRenderer={headerRendererCallback(index)}
          className=""
          cellRenderer={cellRenderer}
          dataKey={dataKey}
          {...other}
        />
      );
    },
    [headerRendererCallback, cellRenderer]
  );

  return (
    <>
      <Paper className="VirtualizedTableWrapper">
        <AutoSizer className="Dashboard__VirtualizedTable">
          {({ height, width }) => (
            <Table
              height={height}
              width={width}
              rowHeight={rowHeight}
              gridStyle={{
                direction: 'inherit'
              }}
              headerHeight={headerHeight}
              className=""
              {...props}
              rowClassName="d-flex align-items-center">
              {columns.map(handleRenderData)}
            </Table>
          )}
        </AutoSizer>
      </Paper>
    </>
  );
};

export default memo(DashboardVirtualizedTable);
