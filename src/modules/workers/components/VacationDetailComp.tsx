import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, ButtonGroup, Input, Select, SelectItem } from '@nextui-org/react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { VACATION_DETAIL_TYPE_BACKEND } from '../../../lib/consts/general';
import {  VacationDetail } from '../hooks/useVacationStore';
import { Field, useFormikContext } from 'formik';

interface VacationDetailProps {
  row: VacationDetail;
  index: number;
  updateVacationDetail: (detail: VacationDetail) => void;
  deleteVacationDetail: any;
  addVacationDetail: any
  isLoading: boolean;
}

export const VacationDetailComp: React.FC<VacationDetailProps> = ({ row, index, updateVacationDetail, deleteVacationDetail, addVacationDetail, isLoading }) => {
  const { setFieldValue, values } = useFormikContext<{ vacationDetails: VacationDetail[] }>();

  const [item, setItem] = useState<VacationDetail>(row);
  const [settingDays, setSettingDays] = useState<boolean>(
    (row?.id || -1) > 0 ? true : false 
  );
  const [manualDays, setManualDays] = useState<number>(item?.quantity || 0);

  useEffect(() => { 
    setItem(row);
  }, [row]);

  useEffect(() => {
    if (!settingDays) {
      setManualDays(calculateDays());
    }
  }, [item.startDate, item.endDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    console.log("🚀 ~ handleChange ~ { name, value }:", { name, value })

    name = name.split('.').at(-1) || name;
    console.log("🚀 ~ handleChange ~ name:", name)
    // console.log("🚀 ~ handleChange ~ property:", property)

    let newItem: VacationDetail = { ...item, [name]: value };
    
    if (name === 'quantity') {
      setSettingDays(true);
      newItem.quantity = parseInt(value, 10) || 0;
      setManualDays(newItem.quantity);
    } else if (name === 'startDate' || name === 'endDate') {
      setSettingDays(false);
    }
    console.log("🚀 ~ handleChange ~ newItem:", newItem)

    setItem(newItem);
    updateVacationDetail(newItem);
    setFieldValue(`vacationDetails.${index}`, newItem); // Sync with Formik
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
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    }

    const newItem = { ...item, quantity: days }
    setItem(newItem);
    // updateVacationDetail(newItem);
    return days;
  };

  const days = useMemo(() => {
    if (settingDays) {
      return manualDays;
    }

    if (item.startDate || item.endDate || !settingDays) {
      return calculateDays();
    }

    return 0;
  }, [item?.startDate, item?.endDate, settingDays, manualDays]);

  return (
    <div className="custom-shadow mx-2 my-4 grid grid-cols-1 rounded-md py-4 md:grid-cols-10">
      <div className="col-span-1 flex items-center justify-center">{index + 1}</div>

      <div className="col-span-8 grid gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field name={`vacationDetails.${index}.startDate`}>
            {({ field }: { field: any }) => (
              <Input
                {...field}
                label="Fecha de Inicio"
                type="date"
                value={item.startDate}
                onChange={handleChange}
              />
            )}
          </Field>

          <Field name={`vacationDetails.${index}.endDate`}>
            {({ field }: { field: any }) => (
              <Input
                {...field}
                label="Fecha de Fin"
                type="date"
                value={item.endDate}
                onChange={handleChange}
              />
            )}
          </Field>

          <Field name={`vacationDetails.${index}.quantity`}>
            {({ field }: { field: any }) => (
              <Input
                {...field}
                label="Cant. de días"
                type="number"
                value={days.toString()}
                onChange={handleChange}
              />
            )}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Field name={`vacationDetails.${index}.vacationType`}>
            {({ field }: { field: any }) => (
              <Select
                {...field}
                className="col-span-1"
                label="Tipo de vacaciones"
                variant="bordered"
                placeholder="Seleccionar tipo"
                value={item.vacationType}
                selectedKeys={[item.vacationType]}
                onChange={(e) => handleChange(e as any)}
              >
                {VACATION_DETAIL_TYPE_BACKEND.map((type: { value: string; label: string }) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </Select>
            )}
          </Field>

          <Field name={`vacationDetails.${index}.reason`}>
            {({ field }: { field: any }) => (
              <Input {...field} label="Razón" value={item.reason} onChange={handleChange} />
            )}
          </Field>
        </div>
      </div>

      <div className="flex items-center justify-center md:col-span-1">
        <ButtonGroup>
        <Button type="button" color='danger' onClick={deleteVacationDetail} isIconOnly isLoading={isLoading}>
            <FontAwesomeIcon icon={faTrash} />
        </Button>
        <Button type="button" color="primary" onClick={addVacationDetail} isIconOnly isLoading={isLoading}>
            <FontAwesomeIcon icon={faPlus} />
        </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};
