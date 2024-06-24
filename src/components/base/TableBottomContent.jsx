import React from 'react'
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Pagination } from '@nextui-org/react'

export const TableBottomContent = ({ paginationProps, updatingList }) => {
    console.log("🚀 ~ TableBottomContent ~ paginationProps:", paginationProps)

    const [selectedKeys, setSelectedKeys] = React.useState(new Set([paginationProps.itemsPerPage.toString()]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
        [selectedKeys]
    );

    const updatePage = (page) => {
        updatingList('currentPage', page)
    }

    const onSelectionChange = (keys) => {
        console.log("🚀 ~ onSelectionChange ~ keys:", keys)
        updatingList('itemsPerPage', parseInt(keys.currentKey))
        setSelectedKeys(keys)
    }

    return (
        <div className="py-2 px-2 flex justify-between items-center">
            <div className='flex flex-wrap items-center'>
                <Dropdown>
                    <DropdownTrigger>
                        <Button
                            variant="bordered"
                            className="capitalize"
                        >
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
                <small className='text-xs ms-2'>filas por página</small>
            </div>
            <Pagination isCompact showControls showShadow
                color="primary" page={paginationProps.currentPage}
                total={paginationProps.totalPages} onChange={updatePage} />
        </div>
    )
}
