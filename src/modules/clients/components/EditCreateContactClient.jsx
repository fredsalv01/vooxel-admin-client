import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { CardBase } from "../../../components/base";
import {
  Button,
  ButtonGroup,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {
  DownloadCloud,
  EditIcon,
  DeleteIcon,
  PlusIcon,
} from "../../../components/icons";
import Slot from "../../../components/Slot";
import InternationalizationDate from "../../../lib/helpers/internationalization-date";

import { useFetchData } from "../../../hooks/useFetchData";
import { EditCreateContactClientModal } from "./";
import {
  NO_HAS_FILES,
  TABLE_NAME_FILES,
  TAGS_FILES,
} from "../../../lib/consts/general";

export const EditCreateContactClient = ({ itemId }) => {
  const { data, isLoading, fetchData } = useFetchData({
    url: `/contact/client/${itemId}`,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editItem, setEditItem] = useState({});

  const [rows, setRows] = useState([]);

  useEffect(() => {
    if (!!data) {
      const newRows = data.map((item, index) => {
        return {
          ...item,
        };
      });
      setRows(newRows);
    }
  }, [data]);

  const columns = [
    {
      key: "name",
      label: "Nombre",
    },
    {
      key: "phone",
      label: "Teléfono",
    },
    // {
    //   key: "isActive",
    //   label: "Estado",
    // },
    {
      key: "actions",
      label: "Acciones",
    },
  ];

  const handleEditContact = (item) => {
    setEditItem(item);
    onOpen();
  };

  const handleDeleteContact = async (item) => {
    // try {
    // } catch (error) {
    // }
    // const response = await axiosInstance.delete(`contact/${item.id}`);
    // if (response.status === 200) {
    //   fetchData();
    //   ToastNotification.showSuccess("Contacto eliminado correctamente
  };

  const renderCell = useCallback(
    (item, columnKey) => {
      const cellValue = item[columnKey];

      switch (columnKey) {
        case "actions":
          return (
            <div className="flex justify-center">
              <ButtonGroup>
                <Button
                  isIconOnly
                  color="white"
                  className="p-0"
                  onClick={() => handleEditContact(item)}
                >
                  <EditIcon />
                </Button>
                <Button
                  isIconOnly
                  color="white"
                  className="p-0 text-danger"
                  onClick={() => handleDeleteContact(item)}
                >
                  <DeleteIcon />
                </Button>
              </ButtonGroup>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [rows],
  );

  const classNames = useMemo(
    () => ({
      wrapper: ["shadow-none", "p-0"],
      th: ["text-center"],
    }),
    [],
  );

  return (
    <>
      {isOpen && (
        <EditCreateContactClientModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          item={editItem}
          items={rows}
          parentId={itemId}
          fetchData={fetchData}
        />
      )}
      <CardBase title="Contactos" async={isLoading} skeletonlines={5}>
        <Slot slot="header">
          <Button
            size="sm"
            onPress={() => {
              setEditItem({});
              onOpen();
            }}
            color="primary"
            endContent={<PlusIcon />}
          >
            Agregar
          </Button>
        </Slot>
        <Slot slot="body">
          <Table
            aria-label="Table contact's clients"
            isStriped
            classNames={classNames}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Slot>
      </CardBase>
    </>
  );
};

EditCreateContactClient.propTypes = {
  itemId: PropTypes.string.isRequired,
};
