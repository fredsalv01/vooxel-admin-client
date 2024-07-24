import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";

import { CardBase } from "../../../components/base";
import {
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { DownloadCloud, EditIcon, PlusIcon } from "../../../components/icons";
import Slot from "../../../components/Slot";
import InternationalizationDate from "../../../lib/helpers/internationalization-date";

import { useFetchData } from "../../../hooks/useFetchData";
import { useUploadFile } from "../../../hooks/useUploadFile";
import { EditCreateCertificationModal } from "./EditCreateCertificationModal";
import { TABLE_NAME_FILES, TAGS_FILES } from "../../../lib/consts/general";

export const EditCreateCertification = ({ itemId, reFetchData }) => {
  const { data, isLoading, fetchData } = useFetchData({
    url: `/certifications/${itemId}`,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [editItem, setEditItem] = useState({});

  const [rows, setRows] = useState([]);

  const { getFileInfo, isLoading: isLoadingFile } = useUploadFile({
    tableName: TABLE_NAME_FILES.certifications,
  });

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
      key: "certificationName",
      label: "Nombre",
    },
    {
      key: "actions",
      label: "Acciones",
    },
  ];

  const handleEditCerfication = (item) => {
    setEditItem(item);
    onOpen();
  };

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];

    switch (columnKey) {
      // case 'certificationName':
      //     return InternationalizationDate().formatDate(new Date(cellValue));
      case "actions":
        return (
          <div className="flex justify-center gap-2">
            <ButtonGroup>
              <Button
                isIconOnly
                color="white"
                className="p-0"
                onClick={() => handleEditCerfication(item)}
              >
                <EditIcon />
              </Button>
              <Button
                isIconOnly
                color="white"
                onClick={getFileInfo({
                  tag: TAGS_FILES.certification,
                  rowTableId: item.id,
                })}
                isLoading={isLoadingFile}
              >
                <DownloadCloud />
              </Button>
            </ButtonGroup>
          </div>
        );
      default:
        return cellValue;
    }
  });

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
        <EditCreateCertificationModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          item={editItem}
          items={rows}
          parentId={itemId}
          fetchData={() => {
            fetchData();
            reFetchData();
          }}
        />
      )}
      <CardBase title="Certificaciones" async={isLoading} skeletonlines={5}>
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
            aria-label="Example table with dynamic content"
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
                <TableRow key={item.key}>
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

EditCreateCertification.propTypes = {
  itemId: PropTypes.string.isRequired,
};
