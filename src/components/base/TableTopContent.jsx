import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@nextui-org/react'
import React, { useRef, useState } from 'react'
import { ChevronDownIcon, SearchIcon } from '../icons'
import { capitalize } from '../../lib/helpers/utils';

export const TableTopContent = ({ visibleColumns, headersTable, setVisibleColumns, setQuerSearch, children }) => {

  const [inputSearch, setInputSearch] = useState();

  const onSearchChange = (value) => {
    setInputSearch(value);
    setQuerSearch(value);
  }

  // const handleVisibleColumnsChange = (keys) => {
  //   console.log("🚀 ~ handleVisibleColumnsChange ~ keys:", keys)
  //   onVisibleColumnsChange(keys);
  // };

  return (
    <div>
      <div className="gap-3 flex flex-wrap md:flex-nowrap justify-between">
        <Input
          isClearable
          placeholder="Buscar..."
          startContent={<SearchIcon />}
          value={inputSearch}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
          type="search"
          className="lg:min-w-[500px] w-full md:w-auto"
        />
        <div className="flex gap-3 justify-end">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
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
