import { Button, getKeyValue, Input, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../../../axios/axios';
import { SpinnerButton } from '../../../components/icons';

export const EditCreateEmergencyContact = ({ itemId }) => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('workerId', itemId);
      try {
        const { data } = await axiosInstance.get(`/emergency_contacts/${itemId}`);
        if (data.length > 0) {
          console.log("🚀 ~ useEffect ~ data:", data);
          const parseData = data.map((item) => ({
            id: item.id,
            name: item.name,
            relation: item.relation,
            phone: item.phone,
            origin: 'backend',
          }));
          setRows(parseData);
        }
      } catch (error) {
        console.error('error', error);
      }
    };
    fetchData();
  }, [itemId]);

  const columns = [
    // { key: "id", label: "ID" },
    { key: "name", label: "Nombre" },
    { key: "relation", label: "Relación" },
    { key: "phone", label: "Teléfono" },
    // { key: "origin", label: "Origen" },
    { key: "actions", label: "Acciones" },
  ];

  const addNewContact = () => {
    const hasOne = rows.filter(row => row.origin === 'frontend').length > 0;
    if (hasOne) return;
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
  };

  const handleCreate = async (id) => {
    setLoading(true);
    const contact = rows.find(row => row.id === id);
    try {
      await axiosInstance.post('/emergency_contacts', {
        workerId: itemId,
        name: contact.name,
        relation: contact.relation,
        phone: contact.phone,
      });
      alert('Contact created successfully');
    } catch (error) {
      console.error('Error creating contact:', error);
      alert('Failed to create contact');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    setLoading(true);
    const contact = rows.find(row => row.id === id);
    try {
      await axiosInstance.patch(`/emergency_contacts/${id}`, {
        workerId: itemId,
        name: contact.name,
        phone: contact.phone,
        relation: contact.relation,
      });
      alert('Contact updated successfully');
    } catch (error) {
      console.error('Error updating contact:', error);
      alert('Failed to update contact');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {

    if (item.origin === 'frontend') {
      rows.splice(rows.findIndex(row => row.id === item.id), 1);
      setRows([...rows]);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.delete(`/emergency_contacts/${item.id}`);
      setRows(rows.filter(row => row.id !== item.id));
      alert('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Failed to delete contact');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (id, key, value) => {
    setRows(rows.map(row => (row.id === id ? { ...row, [key]: value } : row)));
  };

  const renderCell = useCallback((item, columnKey) => {
    const cellValue = item[columnKey];
    switch (columnKey) {
      case "name":
      case "relation":
      case "phone":
        return (
          <Input
            type='text'
            value={cellValue}
            onChange={(e) => handleInputChange(item.id, columnKey, e.target.value)}
          />
        );
      case "actions":
        return (
          <div className='flex gap-2 items-center'>
            {item.origin === 'backend' && (
              <Button
                isLoading={loading}
                spinner={<SpinnerButton />}
                size='sm'
                color="secondary"
                onClick={() => handleEdit(item.id)}
              >
                Editar
              </Button>
            )}
            {item.origin === 'frontend' && <Button
              isLoading={loading}
              spinner={<SpinnerButton />}
              size='sm'
              color="primary"
              onClick={() => handleCreate(item.id)}
            >
              Crear
            </Button>}
            <Button
              isLoading={loading}
              spinner={<SpinnerButton />}
              size='sm'
              color="danger"
              onClick={() => handleDelete(item)}
            >
              Eliminar
            </Button>
          </div>
        );
      default:
        return cellValue;
    }
  }, [rows]);

  return (
    <>
      <div className='flex'>
        <h2 className='flex-1 text-2xl mb-3'>Contactos de emergencia</h2>
        <Button color="primary" onClick={addNewContact}>
          Agregar nuevo
        </Button>
      </div>
      <div className='my-4'>
        <Table aria-label="Table emergency contacts">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell key={columnKey}>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};
