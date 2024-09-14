import React, { useEffect, useState } from "react";
import { Button, useDisclosure } from "@nextui-org/react";
import { Link } from "react-router-dom";

import Slot from "../../../components/Slot";
import { TableList } from "../../../components/base";
import { useQueryPromise } from "../../../hooks/useQueryPromise";
import { EditIcon, PlusIcon } from "../../../components/icons";
import { useFetchData } from "../../../hooks/useFetchData";

const headersTable = [
  { name: "Razon social", uid: "businessName" },
  { name: "Ruc", uid: "ruc" },
  { name: "Celular", uid: "phone" },
  { name: "Correo", uid: "email" },
  { name: "Acciones", uid: "actions" },
];

const INITIAL_VISIBLE_COLUMNS = [
  "Nro",
  "businessName",
  "ruc",
  "phone",
  "email",
  "actions",
];

export const BillingList = () => {
  const {
    data,
    isFetching,
    refetch,
    isSuccess,
    paginationProps,
    updatingList,
    setQuerSearch,
  } = useQueryPromise({ url: "workers", key: "workers" });

  const switchRenderCell = (item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "actions":
        return (
          <Link
            to={`/workers/${item.id}/detail`}
            className="text-lg cursor-pointer text-default-400 active:opacity-50"
          >
            <EditIcon />
          </Link>
        );
      default:
        return cellValue;
    }
  };

  return (
    <>
      <TableList
        title="Facturación"
        items={data?.items || []}
        headersTable={headersTable}
        switchFn={switchRenderCell}
        initialColumns={INITIAL_VISIBLE_COLUMNS}
        isLoading={isFetching}
        paginationProps={paginationProps}
        updatingList={updatingList}
        setQuerSearch={setQuerSearch}
      >
        <Slot slot="topContent">
          {/* onPress={onOpen} */}
          <Button
            as={Link}
            to={`/billing/create`}
            color="primary"
            endContent={<PlusIcon />}
          >
            {/* onClick={onOpen} */}
            Agregar
          </Button>
        </Slot>
      </TableList>
    </>
  );
};
