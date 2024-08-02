import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@nextui-org/react";
import { VacationDetail } from "./VacationDetail";
import { PlusIcon } from "../../../components/icons";
import { VACATION_DETAIL_TYPE_BACKEND } from "../../../lib/consts/general";
import axiosInstance from "../../../axios/axios";
import { ToastNotification } from "../../../lib/helpers/toast-notification-temp";

export const FormDataWorkerVacation = ({
  vacationsDetailActive,
  vacationId,
  fetchData,
}) => {
  const [form, setForm] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!!vacationsDetailActive && vacationsDetailActive.length > 0) {
      setForm(vacationsDetailActive);
    }
  }, [vacationsDetailActive]);

  const addRow = () => {
    let newForm = [];

    newForm = [
      ...form,
      {
        id: -1,
        startDate: "",
        endDate: "",
        days: 0,
        vacationType: VACATION_DETAIL_TYPE_BACKEND[2].value,
        reason: "",
      },
    ];
    setForm(newForm);
  };

  const handleChange = (newItem, index) => {
    const newForm = [...form];
    newForm[index] = newItem;
    setForm(newForm);
  };

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
  };

  const onSubmit = async () => {
    try {
      setIsLoading(true);
      // validate if the days sum are greater than the remaining days
      const sumDays = [...form].reduce(
        (acc, item) => item.vacationType === "pendientes" && acc + item.days,
        0,
      );
      if (sumDays > vacationsDetailActive.remainingVacations) {
        ToastNotification.showWarning(
          "La suma de los días no puede ser mayor a los días restantes",
        );
        return;
      }

      const newForm = [...form];

      const { newDates, oldDates } = newForm.reduce(
        (acc, item) => {
          item = {
            ...item,
            quantity: item.days,
            vacationId,
          };
          delete item.days;
          if (item.id < 0) {
            delete item.id;
            acc.newDates.push(item);
          } else {
            acc.oldDates.push(item);
          }
          return acc;
        },
        { newDates: [], oldDates: [] },
      );

      await axiosInstance.put(`/vacation-details/vacation/${vacationId}`, {
        items: [...newDates, ...oldDates],
      });

      fetchData();
      ToastNotification.showSuccess("Vacaciones actualizadas");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-1 justify-end">
        <Button
          size="sm"
          onPress={() => addRow()}
          color="primary"
          endContent={<PlusIcon />}
        >
          Agregar
        </Button>
      </div>

      
        <div
          className="grid overflow-auto "
          style={{ maxHeight: "calc(100vh - 450px)" }}
        >
          {form.map((item, index) => (
            <React.Fragment key={index}>
              <VacationDetail
                row={item}
                indexRow={index}
                onChangeForm={(newItem) => handleChange(newItem, index)}
                onDeleteRow={onDelete}
                form={form}
              />
            </React.Fragment>
          ))}
        </div>
      
      <div className="mt-4 flex flex-1 justify-end">
        <Button onPress={onSubmit} color="success" isLoading={isLoading}>
          Actualizar
        </Button>
      </div>
    </div>
  );
};
// validate props
FormDataWorkerVacation.propTypes = {
  vacationsDetailActive: PropTypes.array,
  vacationId: PropTypes.number,
  fetchData: PropTypes.func,
};
