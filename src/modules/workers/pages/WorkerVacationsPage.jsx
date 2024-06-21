import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { CardBase, InputBase } from '../../../components/base';
import { Button, Input } from '@nextui-org/react';
import Slot from '../../../components/Slot';
import { PlusIcon } from '../../../components/icons';
import { VacationDetail } from '../components';

export const WorkerVacationsPage = () => {

  const { id } = useParams();
  const [form, setForm] = useState([
    {
      startDate: '',
      endDate: '',
      days: 0
    }
  ]);

  const addRow = () => {

    const newForm = [...form, {
      startDate: '',
      endDate: '',
      days: 0
    }];

    setForm(newForm);
  }

  const handleChange = (newItem, index) => {
    const newForm = [...form];
    newForm[index] = newItem;
    setForm(newForm);
  }

  const onDelete = (index) => {
    console.log("🚀 ~ onDelete ~ index:", index)
    const newForm = [...form];
    newForm.splice(index, 1);
    setForm(newForm);
  }

  const onSubmit = () => {

  }

  return (
    <div className='flex flex-col'>

      <CardBase title='Vacaciones del trabajador'>
        <Slot slot="header">
          <Button size='sm' onPress={addRow} color="primary" endContent={<PlusIcon />}>Agregar</Button>
        </Slot>
        <Slot slot="body">
          <div className='grid gap-4'>
            {
              form.map((item, index) => (
                <React.Fragment key={index}>
                  <VacationDetail row={item} indexRow={index} onChangeForm={(newItem) => handleChange(newItem, index)} onDeleteRow={onDelete} form={form} />
                </React.Fragment>
              ))
            }
          </div>
        </Slot>

        <Slot slot="footer">
          <div className='flex justify-end flex-1'>
            <Button onPress={onSubmit} color="success">Actualizar</Button>
          </div>
        </Slot>
      </CardBase>
    </div>

  )
}
