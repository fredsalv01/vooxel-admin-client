import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input } from '@nextui-org/react'
import React, { useState } from 'react'
import { ChevronDownIcon, SearchIcon } from '../icons'

export const TableTopContent = ({ content, visibleColumns, setVisibleColumns, headersTable }) => {

  const [inputSearch, setInputSearch] = useState();

  const onSearchChange = (value) => {

  }

  return (
    <div className="gap-3 flex flex-wrap md:flex-nowrap">
      <Input
        isClearable
        placeholder="Buscar..."
        startContent={<SearchIcon />}
        value={inputSearch}
        onClear={() => onClear()}
        onValueChange={onSearchChange}
        type="search"
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

        {content}
        {/* <Button onPress={onOpen} color="primary" endContent={<PlusIcon />}>
          Agregar
        </Button> */}
      </div>
    </div>
  )
}
