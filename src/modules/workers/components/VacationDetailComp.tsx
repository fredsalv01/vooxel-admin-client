import React, { useMemo, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Input, Select, SelectItem } from '@nextui-org/react'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { VACATION_DETAIL_TYPE_BACKEND } from '../../../lib/consts/general'
import { ToastNotification } from '../../../lib/helpers/toast-notification-temp'
import axiosInstance from '../../../axios/axios'
import { Alerts } from '../../../lib/helpers/alerts'
import { useVacationStore, VacationDetail } from '../hooks/useVacationStore'

interface VacationDetailProps {
  row: any;
  index: number;
  fetchData: () => void;
  updateVacationDetail: (index: number, detail: any) => void;
  deleteVacationDetail: (index: number) => void;
}


export const VacationDetailComp: React.FC<VacationDetailProps> = ({ index, row, fetchData, updateVacationDetail, deleteVacationDetail }) => {
  const [item, setItem] = useState<Partial<VacationDetail>>(row || {})
  
  const [settingDays, setSettingDays] = useState(
    (item?.id ?? -1) > 0 ? true : false,
  )
  const [manualDays, setManualDays] = useState(item?.quantity || 0)
  
  useEffect(() => {
    console.log("🚀 ~ item:", item)
    console.log("🚀 ~ settingDays:", settingDays)
    if (!settingDays) {
      setManualDays(calculateDays())
    }
  }, [item.startDate, item.endDate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    console.log('🚀 ~ handleChange ~ { name, value }:', { name, value })

    if (name === 'quantity') {
      setSettingDays(true)
      setManualDays(parseInt(value, 10))
    } else if (name === 'startDate' || name === 'endDate') {
      setSettingDays(false)
    }

    const newItem = {
      ...item,
      [name]: name === 'quantity' ? parseInt(value || '0') : value,
    }
    console.log("🚀 ~ handleChange ~ newItem:", newItem)

    setItem(newItem)
    updateVacationDetail(index, newItem)
  }

  const checkDates = () => {
    const { startDate, endDate } = item
    if (!startDate || !endDate) return false

    const start = new Date(startDate)
    const end = new Date(endDate)
    return start <= end
  }

  const calculateDays = () => {
    if (!checkDates()) return 0
    let days = 0
    if (item.startDate && item.endDate) {
      const startDate = new Date(item.startDate)
      const endDate = new Date(item.endDate)
      days = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    }
    setItem({...item, quantity: days })
    return days
  }

  const deleteRow = async () => {
    if ((item?.id ?? -1) > 0) {
      const { isConfirmed } = await Alerts.confirmAlert({})
      if (!isConfirmed) return
      try {
        await axiosInstance.delete(`/vacation-details/${item.id}`)
        deleteVacationDetail(index)
        ToastNotification.showSuccess('Vacación eliminada')
      } catch (error) {
        ToastNotification.showError('Error al eliminar vacación')
      } finally {
        setTimeout(() => {
          fetchData()
        }, 2000)
      }
    } else {
      deleteVacationDetail(index)
    }
  }

  const days = useMemo(() => {
    console.log('🚀 ~ days ~ settingDays:', settingDays)
    if (settingDays) {
      return manualDays
    }

    if (item.startDate || item.endDate || !settingDays) {
      return calculateDays()
    }

    return manualDays
  }, [item?.startDate, item?.endDate, settingDays, manualDays])

  return (
    <div className="custom-shadow mx-2 my-4 grid grid-cols-1 rounded-md py-4 md:grid-cols-10">
      <div className="col-span-1 flex items-center justify-center">
        {index + 1}
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
            name="quantity"
            value={days.toString()}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Select
            className="col-span-1"
            label="Tipo de vacaciónes"
            variant="bordered"
            placeholder="Seleccionar tipo"
            name="vacationType"
            value={item.vacationType}
            selectedKeys={item.vacationType ? [item.vacationType] : []}
            onChange={(e) => {
              handleChange(e)
            }}
          >
            {VACATION_DETAIL_TYPE_BACKEND.map((item: { value: string; label: string }) => (
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

      <div className="flex items-center justify-center md:col-span-1">
        <Button
          type="button"
          onClick={deleteRow}
          isIconOnly
          className="bg-white"
        >
          <span className="text-red-500">
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </Button>
      </div>
    </div>
  )
}
