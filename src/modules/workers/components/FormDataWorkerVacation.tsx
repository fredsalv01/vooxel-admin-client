import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/react';
import { VacationDetail } from './VacationDetail';
import { PlusIcon } from '../../../components/icons';
import { VACATION_DETAIL_TYPE_BACKEND } from '../../../lib/consts/general';
import axiosInstance from '../../../axios/axios';
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp';
import { useVacationStore } from '../hooks/useVacationStore';

interface Props {
  fetchData: () => void;
}

export const FormDataWorkerVacation: React.FC<Props> = ({ fetchData }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Shallow comparison to get state from Zustand store
  const vacationDetails = useVacationStore(state => state.vacationDetails);
  const vacation = useVacationStore(state => state.vacation);
  const addVacationDetail = useVacationStore(state => state.addVacationDetail);
  const remainingVac = useVacationStore(state => state.computed.remainingVac);

  const addRow = () => {
    addVacationDetail({
      index: vacationDetails.length,
      startDate: '',
      endDate: '',
      quantity: 0,
      vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value,
      reason: '',
    } as Partial<VacationDetail>);
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);

      const sumDays = vacationDetails.reduce(
        (acc, item) => item.vacationType === 'pendientes' ? acc + item.quantity : acc,
        0,
      );

      if (sumDays > remainingVac) {
        ToastNotification.showWarning(
          'La suma de los días no puede ser mayor a los días restantes',
        );
        return;
      }

      const { newDates, oldDates } = [...vacationDetails].reduce(
        (acc: { newDates: Partial<VacationDetail>[]; oldDates: Partial<VacationDetail>[] }, item) => {
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
        { newDates: [], oldDates: [] },
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
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-1 justify-end">
        <Button size="sm" onPress={addRow} color="primary" endContent={<PlusIcon />}>
          Agregar
        </Button>
      </div>

      <div className="grid overflow-auto" style={{ maxHeight: 'calc(100vh - 450px)' }}>
        {vacationDetails.length > 0 ? (
          vacationDetails.map((item, index) => (
            <React.Fragment key={index}>
              <VacationDetail
                index={index}
                vacation={vacation}
                fetchData={fetchData}
              />
            </React.Fragment>
          ))
        ) : null}
      </div>

      <div className="mt-4 flex flex-1 justify-end">
        <Button onPress={onSubmit} isDisabled={vacationDetails.length === 0} color="success" isLoading={isLoading}>
          Actualizar
        </Button>
      </div>
    </div>
  );
};
