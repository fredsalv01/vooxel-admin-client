import React, { useState } from 'react'
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from '@nextui-org/react'

import { ChevronDownIcon, SearchIcon } from '../icons'
import { capitalize } from '../../lib/helpers/utils'

export const TableTopContent = ({
  title,
  visibleColumns,
  headersTable,
  setVisibleColumns,
  setQuerySearch,
  children,
}) => {
  const [inputSearch, setInputSearch] = useState()

  const onSearchChange = (value) => {
    setInputSearch(value)
    setQuerySearch(value)
  }

  const onClear = () => {
    setInputSearch('')
    setQuerySearch('')
  }

  return (
    <div>
      <div className="flex flex-wrap justify-between gap-3 md:flex-nowrap">
        <h2 className="text-xl font-semibold">{title}</h2>

        <Input
          isClearable
          placeholder="Buscar..."
          startContent={<SearchIcon />}
          value={inputSearch}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
          type="text"
          className="w-full md:w-auto lg:min-w-[500px]"
        />
        <div className="flex justify-end gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<ChevronDownIcon className="text-small" />}
                variant="flat"
              >
                Columnas
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Table Columns"
              closeOnSelect={false}
              selectedKeys={visibleColumns}
              selectionMode="multiple"
              onSelectionChange={setVisibleColumns}
            >
              {headersTable.map((column) => (
                <DropdownItem key={column.uid} className="capitalize">
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {children}
        </div>
      </div>
    </div>
  )
}
