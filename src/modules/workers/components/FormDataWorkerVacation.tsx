import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { VacationDetailComp } from './VacationDetailComp';
import { VACATION_DETAIL_TYPE_BACKEND } from '../../../lib/consts/general';
import axiosInstance from '../../../axios/axios';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import { useVacationStore, VacationDetail } from '../hooks/useVacationStore';
import { Formik, Form, FieldArray } from 'formik'
import * as Yup from 'yup'
import { Alerts } from '../../../lib/helpers/alerts';

interface Props {
  fetchData: () => void;
  vacationId: number;
  vacationDetails: VacationDetail[];
  remainingVac: number;
  setVacationDetails: (vacationDetails: VacationDetail[]) => void;
  onAddVacationDetail: (push: (value: any) => void) => void;
}

type FormValues = {
  vacationDetails: VacationDetail[];
}

// Validation schema using Yup
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

export const FormDataWorkerVacation: React.FC<Props> = ({ 
  fetchData, vacationId,
  vacationDetails,
  remainingVac,
  setVacationDetails,
  onAddVacationDetail,
}) => {

  const [isLoading, setIsLoading] = useState(false);

  // const vacationDetails = useVacationStore(state => state.vacationDetails);
  // const remainingVac = useVacationStore(state => state.computed.remainingVac);
  // const setVacationDetails = useVacationStore(state => state.setVacationDetails);

  const [initialValues, setInitialValues] = useState<FormValues>({
    vacationDetails: vacationDetails.length > 0 ? vacationDetails : [
      { index: vacationDetails.length, startDate: '', endDate: '', quantity: 0, vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value, reason: '' }
    ]
  });

  useEffect(() => { 
    if (JSON.stringify(initialValues) !== JSON.stringify(vacationDetails) && vacationDetails.length > 0) {
      setInitialValues({
        vacationDetails: vacationDetails.length > 0 ? vacationDetails : [
          { index: vacationDetails.length, startDate: '', endDate: '', quantity: 0, vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value, reason: '' }
        ]
      });
    }
  }, [vacationDetails]);

  const removeVacationDetailByIndex = useVacationStore(
    (state) => state.removeVacationDetailByIndex,
  )
  
  const deleteVacationDetail = (index: number) => { 
    removeVacationDetailByIndex(index);
  }

  const deleteRow = async (item: VacationDetail, index: number, values: FormValues,  remove: (index: number) => void) => {
    console.log("🚀 ~ deleteRow ~ index:", index)
    if (values.vacationDetails.length === 1) {
      ToastNotification.showWarning('No puedes eliminar todas las vacaciones');
      return;
    }
    
    if ((item?.id ?? -1) > 0) {
      const { isConfirmed } = await Alerts.confirmAlert({})
      if (!isConfirmed) return
      try {
        setIsLoading(true)
        await axiosInstance.delete(`/vacation-details/${item.id}`)
        remove(index)
        deleteVacationDetail(index)
        ToastNotification.showSuccess('Vacación eliminada')
      } catch (error) {
        ToastNotification.showError('Error al eliminar vacación')
      } finally {
        setIsLoading(false)
        setTimeout(() => {
          fetchData()
        }, 1500)
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

      await axiosInstance.put(`/vacation-details/vacation/${vacationId}`, {
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
          {/* Vacation details array */}
          <FieldArray name="vacationDetails">
            {({ push, remove }) => (
              <div className="grid overflow-auto" style={{ maxHeight: 'calc(100vh - 450px)' }}>
                {values.vacationDetails.length > 0 &&
                  values.vacationDetails.map((vacationDetail: any, index: number) => (
                    <React.Fragment key={index}>
                      <VacationDetailComp
                        index={index}
                        row={vacationDetail}
                        // fetchData={fetchData}
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
  );
};
