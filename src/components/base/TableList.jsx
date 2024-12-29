import React, { useCallback, useMemo, useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spinner,
} from '@nextui-org/react'
import { TableTopContent } from './TableTopContent'
import { isSlot } from '../Slot'
import { TableBottomContent } from './TableBottomContent'

export const TableList = ({
  title = '',
  items = [],
  headersTable,
  initialColumns,
  switchFn,
  isLoading,
  paginationProps,
  updatingList,
  setQuerySearch,
  children,
}) => {
  const topContentSlot = React.Children.toArray(children).find((child) =>
    isSlot('topContent', child),
  )

  const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  const [visibleColumns, setVisibleColumns] = useState(new Set(initialColumns))

  const headerColumns = useMemo(() => {
    if (visibleColumns === 'all') return headersTable
    const columns = headersTable.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    )
    return columns && columns.length > 0 ? columns : headersTable
  }, [visibleColumns, headersTable])

  const renderCell = useCallback(
    (item, columnKey) => switchFn(item, columnKey),
    [switchFn],
  )

  const computedTopContent = useMemo(
    () => (
      <TableTopContent
        title={title}
        visibleColumns={visibleColumns}
        headersTable={headersTable}
        setVisibleColumns={setVisibleColumns}
        setQuerySearch={setQuerySearch}
      >
        {topContentSlot && topContentSlot.props.children}
      </TableTopContent>
    ),
    [visibleColumns, headersTable, setQuerySearch, topContentSlot],
  )

  const computedBottomContent = useMemo(
    () => (
      <TableBottomContent
        paginationProps={paginationProps}
        updatingList={updatingList}
        setQuerySearch={setQuerySearch}
        isLoading={isLoading}
      />
    ),
    [paginationProps, updatingList, setQuerySearch],
  )

  return (
    <>
      <Table
        isStriped
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={computedBottomContent}
        bottomContentPlacement="outside"
        classNames={{ wrapper: '' }}
        selectedKeys={selectedKeys}
        topContent={computedTopContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={'Ningun colaborador encontrado'}
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell key={columnKey}>
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  )
}
