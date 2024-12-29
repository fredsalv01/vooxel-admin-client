import React, { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Pagination,
} from '@nextui-org/react'

export const TableBottomContent = ({
  paginationProps,
  updatingList,
  isLoading,
}) => {
  const [selectedKeys, setSelectedKeys] = useState(
    new Set([paginationProps?.itemsPerPage ? paginationProps.itemsPerPage.toString() : '10']),
  )

  useEffect(() => { 
    console.log('🚀 ~ paginationProps:', paginationProps);
  }, [paginationProps])

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(', ').replaceAll('_', ' '),
    [selectedKeys],
  )

  const updatePage = (page) => {
    updatingList('currentPage', page)
  }

  const onSelectionChange = (keys) => {
    // updatingList('itemsPerPage', parseInt(keys.currentKey))
    setSelectedKeys(keys)
  }

  return (
    <div className="flex items-center justify-between px-2 py-2">
      <div className="flex flex-wrap items-center">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="bordered" className="capitalize">
              {selectedValue}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Number items per page"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
          >
            <DropdownItem key="10">10</DropdownItem>
            <DropdownItem key="25">25</DropdownItem>
            <DropdownItem key="50">50</DropdownItem>
            <DropdownItem key="100">100</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <small className="ms-2 text-xs">filas por página</small>
      </div>
      { !isLoading && 
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={paginationProps.currentPage}
          total={paginationProps.totalPages}
          onChange={updatePage}
        /> 
      }
    </div>
  )
}
