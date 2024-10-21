import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faEquals } from '@fortawesome/free-solid-svg-icons'

import { CardBase } from '../../../components/base'
import { Button, Chip } from '@nextui-org/react'
import { Formik, Form, FieldArray } from 'formik'
import Slot from '../../../components/Slot'

import { useFetchData } from '../../../hooks/useFetchData'
import { useWorker } from '../hooks/useWorker'
import { VACATION_DETAIL_TYPE_BACKEND } from '../../../lib/consts/general';

import ReactLoading from 'react-loading'
import { useVacationStore, VacationDetail } from '../hooks/useVacationStore'
import axiosInstance from '../../../axios/axios'
import { VacationDetailComp } from '../components/VacationDetailComp'

import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import * as Yup from 'yup'
import { Alerts } from '../../../lib/helpers/alerts';
import { useShallow } from 'zustand/shallow';

const validationSchema = Yup.object().shape({
  vacationDetails: Yup.array().of(
    Yup.object().shape({
      startDate: Yup.string().required('Start Date is required'),
      endDate: Yup.string().required('End Date is required'),
      quantity: Yup.number().required('Quantity is required').positive().integer(),
      vacationType: Yup.string().required('Vacation Type is required'),
      reason: Yup.string(),
    })
  ),
});

type FormValues = {
  vacationDetails: VacationDetail[];
}


export const WorkerVacationsPage = () => {
  const { id: worderId } = useParams()

  const [isLoading, setIsLoading] = useState(false);

  const {
    data: vacationsWorker,
    fetchData,
    loading,
  } = useFetchData({
    url: `vacations/workerId/${worderId}`,
  })

  const { getWorkerDetails } = useWorker(worderId)

  const vacation = useVacationStore(state => state.vacation)
  const setVacation = useVacationStore(state => state.setVacation)

  const vacationDetails = useVacationStore(useShallow(state => state.vacationDetails))
  const setVacationDetails = useVacationStore(state => state.setVacationDetails)
  const addVacationDetail = useVacationStore(state => state.addVacationDetail)
  
  const accumulatedVac = useVacationStore(state => state.computed.accumulatedVac)
  const takenVac = useVacationStore(state => state.computed.takenVac)
  const remainingVac = useVacationStore(state => state.computed.remainingVac)
  const expiredDays = useVacationStore(state => state.computed.expiredDays)
  const removeVacationDetailByIndex = useVacationStore(
    (state) => state.removeVacationDetailByIndex,
  )

  const [initialValues, setInitialValues] = useState<FormValues>({
    vacationDetails: vacationDetails.length > 0 ? vacationDetails : [
      { index: vacationDetails.length, startDate: '', endDate: '', quantity: 0, vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value, reason: '' }
    ]
  });

  useEffect(() => {
    if (!loading) {
      setVacation(vacationsWorker);
      setVacationDetails(vacationsWorker.vacationDetails);
    }
  }, [loading])

  useEffect(() => { 
    if (vacationDetails.length > 0) {
      setInitialValues({
        vacationDetails: vacationDetails.length > 0 ? vacationDetails : [
          { index: vacationDetails.length, startDate: '', endDate: '', quantity: 0, vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value, reason: '' }
        ]
      });
    } else if (vacationDetails.length === 0) {
      setInitialValues({
        vacationDetails: [
          { index: 0, startDate: '', endDate: '', quantity: 0, vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value, reason: '' }
        ]
      });
    }
    console.log("🚀 ~ WorkerVacationsPage ~ vacationDetails:", vacationDetails)
  }, [vacationDetails, loading]);

  const onAddVacationDetail = (push: any) => {
    const newItem = {
      index: vacationDetails.length,
      startDate: '',
      endDate: '',
      quantity: 0,
      vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value,
      reason: '',
    }
    push(newItem)
    addVacationDetail(newItem);
  }
  
  const deleteVacationDetail = (index: number) => { 
    removeVacationDetailByIndex(index);
  }

  const deleteRow = async (item: VacationDetail, index: number, values: FormValues,  remove: (index: number) => void) => {
    console.log("🚀 ~ deleteRow ~ index:", index)
    if (values.vacationDetails.length === 1 && (item?.id ?? -1) <= -1) {
      ToastNotification.showWarning('No puedes eliminar todas las vacaciones');
      return;
    }
    
    if ((item?.id ?? -1) > 0) {
      const { isConfirmed } = await Alerts.confirmAlert({})
      if (!isConfirmed) return
      try {
        setIsLoading(true)
        const resp = await axiosInstance.delete(`/vacation-details/${item.id}`)
        console.log("🚀 ~ deleteRow ~ resp:", resp)
        remove(index)
        setVacation(resp.data);
        setVacationDetails(resp.data.vacationDetails);
        ToastNotification.showSuccess('Vacación eliminada')
      } catch (error) {
        ToastNotification.showError('Error al eliminar vacación')
      } finally {
        setIsLoading(false)
        // setTimeout(() => {
        //   fetchData()
        // }, 1500)
      }
    } else {
      deleteVacationDetail(index)
      remove(index)
    }
  }

  const handleSubmit = async (
    values: FormValues,
    setSubmitting: (isSubmitting: boolean) => void,
  ) => {
    try {
      setSubmitting(true);

      const sumDays = values.vacationDetails.reduce(
        (acc: number, item: any) =>
          item.vacationType === 'pendientes' ? acc + item.quantity : acc,
        0
      );

      if (sumDays > remainingVac) {
        ToastNotification.showWarning(
          'La suma de los días no puede ser mayor a los días restantes'
        );
        return;
      }

      const { newDates, oldDates } = [...values.vacationDetails].reduce(
        (
          acc: { newDates: Partial<VacationDetail>[]; oldDates: Partial<VacationDetail>[] },
          item
        ) => {
          item = {
            ...item,
            quantity: item.quantity,
            vacationId: item.vacationId,
          };
          if ((item.id ?? -1) < 0) {
            delete item.id;
            acc.newDates.push(item);
          } else {
            acc.oldDates.push(item);
          }
          return acc;
        },
        { newDates: [], oldDates: [] }
      );

      await axiosInstance.put(`/vacation-details/vacation/${vacation.id}`, {
        items: [...newDates, ...oldDates],
      });

      setTimeout(() => {
        fetchData();
      }, 1500);

      ToastNotification.showSuccess('Vacaciones actualizadas');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container flex flex-col">
      {getWorkerDetails.isLoading && <div>Cargando vacaciones...</div>}
      {getWorkerDetails.isError && <div>Error al cargar vacaciones...</div>}
      {getWorkerDetails.isSuccess && (
        <div>
          <div className="mb-4 flex flex-wrap justify-between gap-4">
            <p className="text-xl">
              <strong>Trabajador: {getWorkerDetails.data?.name}</strong> <br />
              {getWorkerDetails.data?.apPat}
            </p>

            <p className="text-xl">
              <strong>Fecha de inicio de trabajo:</strong> <br />{' '}
              {getWorkerDetails.data?.startDate}
            </p>

            <p className="text-xl">
              <strong>Días espirados:</strong> <br /> {expiredDays}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <ReactLoading
                type={'balls'}
                color={'#16a34a'}
                height={300}
                width={300}
              />
            </div>
          ) : (
            <CardBase title="Vacaciones">
              <Slot slot="header">
                <Chip
                  className="gap-1 border-none capitalize text-default-600"
                  color={vacation.isActive ? 'success' : 'danger'}
                  size="sm"
                  variant="dot"
                >
                  {vacation.isActive ? 'Activas' : 'Inactivas'}
                </Chip>
              </Slot>
              <Slot slot="body">
                <div className="my-3 flex flex-wrap justify-between rounded-md border border-blue-600 px-4 py-2">
                  <div>Acumuladas: {accumulatedVac}</div>
                    <FontAwesomeIcon icon={faMinus} />
                  <div>Tomadas: {takenVac}</div>
                    <FontAwesomeIcon icon={faEquals} />
                  <div>Pendientes: {remainingVac}</div>
                </div>
                {vacation.isActive && (
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) =>
                      handleSubmit(values, setSubmitting)
                    }
                    enableReinitialize
                  >
                    {({ isSubmitting, values }) => (
                      <Form>
                        <FieldArray name="vacationDetails">
                          {({ push, remove }) => (
                            <div className="grid overflow-auto" style={{ maxHeight: 'calc(100vh - 450px)' }}>
                              {values.vacationDetails.length > 0 &&
                                values.vacationDetails.map((vacationDetail: any, index: number) => (
                                  <React.Fragment key={index}>
                                    <VacationDetailComp
                                      index={index}
                                      row={vacationDetail}
                                      updateVacationDetail={(detail: any) =>
                                        setVacationDetails([
                                          ...values.vacationDetails.slice(0, index),
                                          detail,
                                          ...values.vacationDetails.slice(index + 1),
                                        ])
                                      }
                                      deleteVacationDetail={() => deleteRow(vacationDetail, index, values, remove)}
                                      addVacationDetail={() => onAddVacationDetail(push)}
                                      isLoading={isLoading}
                                    />
                                  </React.Fragment>
                                ))}
                            </div>
                          )}
                        </FieldArray>

                        {/* Submit button */}
                        <div className="mt-4 flex flex-1 justify-end">
                          <Button
                            size='lg'
                            color="success"
                            className="text-white"
                            type='submit'
                            isLoading={isSubmitting}
                            isDisabled={values.vacationDetails.length === 0}
                          >
                            <span className='font-semibold'>
                              Actualizar
                            </span>
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </Slot>
            </CardBase>
          )}
        </div>
      )}
    </div>
  )
}
