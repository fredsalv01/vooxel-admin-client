import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { CardBase, InputBase } from '../../../components/base';
import { Button, Chip, Divider, Input } from '@nextui-org/react';
import Slot from '../../../components/Slot';
import { PlusIcon } from '../../../components/icons';
import { VacationDetail } from '../components';
import { useFetchData } from '../../../hooks/useFetchData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axiosInstance from '../../../axios/axios';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import { VACATION_DETAIL_TYPE_BACKEND } from '../../../lib/consts/general';

export const WorkerVacationsPage = () => {

  const { id: worderId } = useParams();

  const { data: vacationsWorker, fetchData } = useFetchData({ url: `vacations/workerId/${worderId}` });

  const { loading, data: wokerDetail } = useFetchData({ url: `/workers/${worderId}` });

  const [vacDetailActive, setVacDetailActive] = useState([]);
  const [vacDetailInactive, setVacDetailInactive] = useState([]);

  // const [historyData, sethistoryData] = useState([]);

  useEffect(() => {
    if (!!vacationsWorker) {
      const { arrVacDetailActive, arrVacDetailInactive } = vacationsWorker.reduce(((acc, item) => {
        if (item.isActive) {
          const details = item.vacationDetails.map(detail => {
            return {
              days: detail.quantity,
              ...detail
            }
          })

          item.vacationDetails = details;

          acc.arrVacDetailActive.push(item);
        } else {
          acc.arrVacDetailInactive.push(item);
        }
        return acc;
      }), { arrVacDetailActive: [], arrVacDetailInactive: [] });



      setVacDetailActive([...arrVacDetailActive]);
      setVacDetailInactive([...arrVacDetailInactive]);
    }
  }, [vacationsWorker]);

  // component
  const FormDataVacation = ({ vacationsDetailActive, vacationId }) => {

    const [form, setForm] = useState([]);

    useEffect(() => {
      if (vacationsDetailActive) {
        const { vacationDetails } = vacationsDetailActive;
        setForm([...vacationDetails]);
      }
    }, [])

    const addRow = () => {
      let newForm = [];

      newForm = [...form, {
        id: -1,
        startDate: '',
        endDate: '',
        days: 0,
        vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value,
        reason: '',
      }];
      setForm(newForm);
    }

    const handleChange = (newItem, index) => {
      const newForm = [...form];
      newForm[index] = newItem;
      setForm(newForm);
    }

    const onDelete = async (index) => {

      const newForm = form.filter((_, i) => i !== index);

      // if (newForm.id > 0 && newForm.vacationType == ) {
      //   try {
      //     const resp = await axiosInstance.delete(`/vacation-details/${newForm.id}`);

      //   } catch (error) {
      //     console.error(error);
      //   }
      // }

      setForm(newForm);
    }

    const onSubmit = async () => {
      try {

        // validate if the days sum are greater than the remaining days
        const sumDays = [...form].reduce((acc, item) => item.vacationType === 'pendientes' && acc + item.days, 0);
        if (sumDays > vacationsDetailActive.remainingVacations) {

          ToastNotification.showWarning('La suma de los días no puede ser mayor a los días restantes');
          return;
        }

        const newForm = [...form]

        const { newDates, oldDates } = newForm.reduce(((acc, item) => {
          item = {
            ...item,
            quantity: item.days,
            vacationId,
          }
          delete item.days;
          if (item.id < 0) {
            delete item.id;
            acc.newDates.push(item);
          } else {
            acc.oldDates.push(item);
          }
          return acc;
        }), { newDates: [], oldDates: [] })

        await axiosInstance.put(`/vacation-details/vacation/${vacationId}`, {
          items: [...newDates, ...oldDates]
        });

        ToastNotification.showSuccess('Vacaciones actualizadas');
        fetchData();
      } catch (error) {
        console.error(error);
      }
    }

    return (
      <div>
        <div className='flex justify-end flex-1 mb-4'>
          <Button size='sm' onPress={() => addRow()} color="primary" endContent={<PlusIcon />}>Agregar</Button>
        </div>
        <div className='grid gap-4 max-h-[400px] overflow-auto'>
          {
            form.map((item, index) => (
              <React.Fragment key={index}>
                <VacationDetail row={item} indexRow={index} onChangeForm={(newItem) => handleChange(newItem, index)} onDeleteRow={onDelete} form={form} />
              </React.Fragment>
            ))
          }
        </div>
        <div className='flex justify-end flex-1 mt-4'>
          <Button onPress={onSubmit} color="success">Actualizar</Button>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col container'>
      {loading && <div>Cargando vacaciones...</div>}
      <h2 className='mb-4'>Trabajador: {wokerDetail?.name} {wokerDetail?.apPat}</h2>
      {
        vacDetailActive.length > 0 && (
          vacDetailActive.map((item, index) => (
            <CardBase title='Vacaciones' key={`data-active-${index}`}>
              <Slot slot="header">
                <Chip
                  className="capitalize border-none gap-1 text-default-600"
                  color={item.isActive ? 'success' : 'danger'}
                  size="sm"
                  variant="dot"
                >
                  {item.isActive ? 'Activas' : 'Inactivas'}
                </Chip>
              </Slot>
              <Slot slot="body">
                <div className='flex flex-wrap justify-between border border-blue-600 px-4 py-2 my-3 rounded-md'>
                  <div>
                    Acumuladas:  {item.accumulatedVacations}
                  </div>
                  <div className='text-blue-600 text-2xl font-semibold'>
                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                  </div>
                  <div>
                    Tomadas:  {item.takenVacations}
                  </div>
                  <div className='text-blue-600 text-2xl font-semibold'>
                    <FontAwesomeIcon icon="fa-solid fa-equals" />
                  </div>
                  <div>
                    Pendientes:  {item.remainingVacations}
                  </div>
                </div>

                {/* <Divider className='mb-3'></Divider> */}

                <FormDataVacation vacationsDetailActive={item} vacationId={item.id}></FormDataVacation>
              </Slot>

              {/* <Slot slot="footer">
                    <div className='flex justify-end flex-1'>
                      <Button onPress={onSubmit} color="success">Actualizar</Button>
                    </div>
                  </Slot> */}
            </CardBase>
          ))
        )
      }


    </div>
  )

  // return (
  //   <>
  //     <pre>{JSON.stringify(data)}</pre>
  //   </>
  // )
}
