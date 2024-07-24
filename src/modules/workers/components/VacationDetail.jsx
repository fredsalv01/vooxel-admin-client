import React, { useMemo, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { VACATION_DETAIL_TYPE_BACKEND } from "../../../lib/consts/general";
import { ToastNotification } from "../../../lib/helpers/toast-notification-temp";
import axiosInstance from "../../../axios/axios";

export const VacationDetail = ({
  row,
  indexRow,
  onChangeForm,
  onDeleteRow,
  form,
}) => {
  const [item, setItem] = useState(row);
  const [settingDays, setSettingDays] = useState(item.id > 0 ? true : false);
  const [manualDays, setManualDays] = useState(item.days || 0);

  useEffect(() => {
    setItem(row);
  }, [row]);

  useEffect(() => {
    if (!settingDays) {
      setManualDays(calculateDays());
    }
  }, [item.startDate, item.endDate]);

  const handleChange = ({ target }) => {
    const { name, value } = target;

    if (name === "days") {
      setSettingDays(true);
      setManualDays(value);
    } else {
      setSettingDays(false);
    }
    console.log("🚀 ~ handleChange ~ value:", value);

    const newItem = {
      ...item,
      [name]: name === "days" ? parseInt(value || 0) : value,
    };

    setItem(newItem);
    onChangeForm(newItem);
  };

  const checkDates = () => {
    const { startDate, endDate } = item;
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  };

  const calculateDays = () => {
    if (!checkDates()) return 0;
    let days = 0;
    if (item.startDate && item.endDate) {
      console.log("🚀 ~ calculateDays ~ item:", item);
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    }
    setItem({ ...item, days });
    return days;
  };

  const deleteRow = async () => {
    if (form.length > 1) {
      if (row.id > 0 && row.vacationType !== "pendientes") {
        ToastNotification.showWarning("No puede eliminar estas vacaciones");
        return;
      }

      if (row.id > 0) {
        try {
          await axiosInstance.delete(`/vacation-details/${row.id}`);
          ToastNotification.showSuccess("Vacaciones pendientes eliminadas");
          onDeleteRow(indexRow);
          return;
        } catch (error) {
          console.log("Error", error);
          ToastNotification.showError(
            "Error al eliminar vacaciones pendientes",
          );
        }
      }

      onDeleteRow(indexRow);
    } else {
      ToastNotification.showError("No se puede eliminar la única fila");
    }
  };

  const days = useMemo(() => {
    if (settingDays) {
      return manualDays;
    }

    if (
      item.startDate !== row.startDate &&
      item.endDate !== row.endDate &&
      !settingDays
    ) {
      return calculateDays();
    }

    return manualDays;
  }, [item.startDate, item.endDate, settingDays, manualDays]);

  const validateAllInputCompleted = () => {};

  return (
    <div className="custom-shadow mx-2 my-4 grid grid-cols-1 rounded-md py-4 md:grid-cols-10">
      <div className="col-span-1 flex items-center justify-center">
        {indexRow + 1}
      </div>

      <div className="col-span-8 grid gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Fecha de inicio"
            type="date"
            name="startDate"
            value={item.startDate}
            onChange={(e) => handleChange(e)}
          />
          <Input
            label="Fecha de Fin"
            type="date"
            name="endDate"
            value={item.endDate}
            onChange={(e) => handleChange(e)}
          />
          <Input
            label="Cant. de días"
            type="number"
            name="days"
            value={days}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            className="col-span-1"
            label="Tipo de vacaciones"
            variant="bordered"
            placeholder="Seleccionar tipo"
            name="vacationType"
            value={item.vacationType}
            selectedKeys={item.vacationType ? [item.vacationType] : []}
            onChange={(e) => {
              handleChange(e);
            }}
          >
            {VACATION_DETAIL_TYPE_BACKEND.map((item) => (
              <SelectItem key={item.value}>{item.label}</SelectItem>
            ))}
          </Select>

          <div className="col-span-2">
            <Input
              label="Razón"
              name="reason"
              value={item.reason}
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
      </div>

      {/* <div className='grid grid-cols-2 md:grid-cols-12 gap-4'> */}

      <div className="flex items-center justify-center md:col-span-1">
        <Button
          type="button"
          onClick={deleteRow}
          isIconOnly
          className="bg-white"
        >
          <span className="text-danger">
            <FontAwesomeIcon icon="fa-solid fa-trash" />
          </span>
        </Button>
      </div>
      {/* </div> */}
    </div>
  );
};
