import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinus, faEquals } from '@fortawesome/free-solid-svg-icons'

import { CardBase } from '../../../components/base'
import { Chip } from '@nextui-org/react'
import { FormDataWorkerVacation } from '../components'
import Slot from '../../../components/Slot'

import { useFetchData } from '../../../hooks/useFetchData'
import { useWorker } from '../hooks/useWorker'

import ReactLoading from 'react-loading'
import { useVacationStore } from '../hooks/useVacationStore'

export const WorkerVacationsPage = () => {
  const { id: worderId } = useParams()

  const {
    data: vacationsWorker,
    fetchData,
    loading,
  } = useFetchData({
    url: `vacations/workerId/${worderId}`,
  })

  const { getWorkerDetails } = useWorker(worderId)

  const vacation = useVacationStore(state => state.vacation)
  const accumulatedVac = useVacationStore(state => state.computed.accumulatedVac)
  const takenVac = useVacationStore(state => state.computed.takenVac)
  const remainingVac = useVacationStore(state => state.computed.remainingVac)
  const expiredDays = useVacationStore(state => state.computed.expiredDays)
  const setVacation = useVacationStore(state => state.setVacation)
  const setVacationDetail = useVacationStore(state => state.setVacationDetails)
  const vacationDetails = useVacationStore(state => state.vacationDetails)
  const setVacationDetails = useVacationStore(state => state.setVacationDetails)

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ loading: part1", loading)
    if (!loading) {
      console.log("🚀 ~ useEffect ~ loading: part2", loading)

      setVacation(vacationsWorker);
      setVacationDetail(vacationsWorker.vacationDetails);
    }
  }, [loading, vacationsWorker, vacationsWorker?.vacationDetails])

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
                  <FormDataWorkerVacation
                    fetchData={() => fetchData()}
                    vacationId={vacation.id}
                    vacationDetails={vacationDetails}
                    remainingVac={remainingVac}
                    setVacationDetails={setVacationDetails}
                  />
                )}
              </Slot>
            </CardBase>
          )}
        </div>
      )}
    </div>
  )
}
