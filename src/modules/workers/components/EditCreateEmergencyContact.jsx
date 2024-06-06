import { Button, ButtonGroup, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axiosInstance from '../../../axios/axios';
import { DeleteIcon, EditIcon, PlusIcon, SpinnerButton } from '../../../components/icons';
import { CardBase } from '../../../components/base';
import { useFetchData } from '../../../hooks/useFetchData';
import Slot from '../../../components/Slot';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import { Alerts } from '../../../lib/helpers/alerts';

export const EditCreateEmergencyContact = ({ itemId }) => {
  const [rows, setRows] = useState([]);
  const [cloneData, setCloneData] = useState([{}]);
  const inputRefs = useRef([]);

  const { data, isLoading, fetchData } = useFetchData({ url: `/emergency_contacts/${itemId}` });

  useEffect(() => {
    if (data) {
      const newRows = data.map((item) => ({
        ...item,
        origin: 'backend',
      }));
      setRows(newRows);
      setCloneData(newRows);
    }
  }, [data]);

  const columns = [
    { key: "name", label: "Nombre" },
    { key: "relation", label: "Relación" },
    { key: "phone", label: "Teléfono" },
    { key: "actions", label: "Acciones" },
  ];

  const addRow = () => {
    const hasOneToCreate = rows.filter(row => row.origin === 'frontend').length > 0;
    if (hasOneToCreate) return;

    const newRowId = Math.max(...rows.map(row => row.id)) + 1;
    setRows([
      ...rows,
      {
        id: newRowId,
        name: "",
        relation: "",
        phone: "",
        origin: 'frontend',
      },
    ]);

    inputRefs.current = [...inputRefs.current, createRef()];
  };

  const handleCreate = async (id) => {
    const contact = rows.find(row => row.id === id);

    if (contact.phone.length !== 9) {
      ToastNotification.showError('El número de celular debe tener 9 dígitos');
      return;
    }


    try {
      Alerts.showLoading();
      await axiosInstance.post('/emergency_contacts', {
        workerId: itemId,
        name: contact.name,
        relation: contact.relation,
        phone: contact.phone,
      });
      ToastNotification.showSuccess('Contacto creado correctamente');
      fetchData();
    } catch (error) {
      if (error.response.status === 400) ToastNotification.showError(error.response.data.message);
      else ToastNotification.showError('Error al crear el contacto');
    } finally {
      Alerts.close();
    }
  };

  const handleUpdate = async (id) => {

    try {
      const contact = rows.find(row => row.id === id);
      const cloneContact = cloneData.find(row => row.id === id);

      if (contact.name === cloneContact.name && contact.phone === cloneContact.phone && contact.relation === cloneContact.relation) {
        ToastNotification.showWarning('No se han realizado cambios en el contacto');
        return;
      }

      if (contact.phone.length !== 9) {
        ToastNotification.showError('El número de celular debe tener 9 dígitos');
        return;
      }

      Alerts.showLoading()
      await axiosInstance.patch(`/emergency_contacts/${id}`, {
        workerId: itemId,
        name: contact.name,
        phone: contact.phone,
        relation: contact.relation,
      });
      ToastNotification.showSuccess('Contacto actualizado correctamente');
      fetchData();
    } catch (error) {
      if (error.response.status === 400) ToastNotification.showError(error.response.data.message);
      else ToastNotification.showError('Error al actualizar el contacto');
    } finally {
      Alerts.close();
    }
  };

  const handleDelete = async (item) => {
    const { isConfirmed } = await Alerts.confirmAlert();
    if (!isConfirmed) return;

    if (item.origin === 'frontend') {
      rows.splice(rows.findIndex(row => row.id === item.id), 1);
      setRows([...rows]);
      return;
    }

    try {
      Alerts.showLoading();
      await axiosInstance.delete(`/emergency_contacts/${item.id}`);
      setRows(rows.filter(row => row.id !== item.id));
      ToastNotification.showSuccess('Contacto eliminado correctamente');
      fetchData();
    } catch (error) {
      if (error.response.status === 400) ToastNotification.showError(error.response.data.message);
      else ToastNotification('Error al eliminar el contacto').showError();
    } finally {
      Alerts.close();
    }
  };

  const handleInputChange = (id, key, value) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const handleKeyDown = (e, currentIndex) => {
    if (e.key === 'Tab') {
      e.preventDefault();

      const nextIndex = (currentIndex + 1) % (inputRefs.current.length);
      const totalInputs = (inputRefs.current.length) * (columns.length - 1);

      inputRefs.current[totalInputs === nextIndex ? 0 : nextIndex].focus();
    }
  };

  const renderCell = useCallback((item, columnKey) => {
    const rowIndex = rows.findIndex(row => row.id === item.id);
    const cellIndex = rowIndex * (columns.length - 1) + columns.findIndex(col => col.key === columnKey);
    const cellValue = item[columnKey];

    switch (columnKey) {
      case "name":
      case "relation":
      case "phone":
        return (
          <Input
            ref={(el) => inputRefs.current[cellIndex] = el}
            type='text'
            value={cellValue}
            onChange={(e) => handleInputChange(item.id, columnKey, e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, cellIndex)}
            onClick={(e) => inputRefs.current[cellIndex].focus()
            }
          />
        );
      case "actions":
        return (
          <div className='flex justify-center'>
            <ButtonGroup>
              {item.origin === 'backend' && (
                <Button
                  isIconOnly
                  color="white"
                  onClick={() => handleUpdate(item.id)}
                >
                  <EditIcon />
                </Button>
              )}
              {item.origin === 'frontend' && <Button
                isIconOnly
                color="white"
                onClick={() => handleCreate(item.id)}
              >
                <span className="text-primary cursor-pointer active:opacity-50">
                  <PlusIcon />
                </span>
              </Button>}
              <Button
                isIconOnly
                color="white"
                onClick={() => handleDelete(item)}
              >
                <span className="text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon />
                </span>
              </Button>
            </ButtonGroup>
          </div>
        );
      default:
        return cellValue;
    }
  }, [rows]);

  const classNames = useMemo(
    () => ({
      wrapper: ["shadow-none", "p-0"],
      th: ["text-center"]
    }),
    [],
  );

  return (
    <>
      <CardBase title='Contactos de emergencia' async={isLoading} skeletonlines={5}>
        <Slot slot="header">
          <Button size='sm' onPress={addRow} color="primary" isDisabled={isLoading} endContent={<PlusIcon />}>Agregar</Button>
        </Slot>
        <Slot slot="body">
          <Table aria-label="Table worker's emergency contacts" classNames={classNames}>
            <TableHeader columns={columns}>
              {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={rows}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (<TableCell key={columnKey}> {renderCell(item, columnKey)}</TableCell>)}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Slot>
      </CardBase>
    </>
  );
};
