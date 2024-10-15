import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { CardBase } from '../../../components/base'
import { Chip } from '@nextui-org/react'
import { FormDataWorkerVacation } from '../components'
import Slot from '../../../components/Slot'

import { useFetchData } from '../../../hooks/useFetchData'
import { useWorker } from '../hooks/useWorker'

import ReactLoading from 'react-loading'

export const WorkerVacationsPage = () => {
  const { id: worderId } = useParams()

  const [vacDetailActive, setVacDetailActive] = useState({})
  const [totalExpiredDays, setTotalExpiredDays] = useState(0)

  const {
    data: vacationsWorker,
    fetchData,
    loading,
  } = useFetchData({
    url: `vacations/workerId/${worderId}`,
  })

  const { getWorkerDetails } = useWorker(worderId)

  useEffect(() => {
    if (vacationsWorker) {
      console.log('🚀 ~ useEffect ~ vacationsWorker:', vacationsWorker)
      setVacDetailActive(vacationsWorker)
      setTotalExpiredDays(vacationsWorker.expiredDays)
    }
  }, [vacationsWorker, vacDetailActive, totalExpiredDays])

  const onDeleteRow = async (indexRow) => {
    const activeDetails = vacDetailActive.vacationDetails.filter(
      (item, index) => index !== indexRow,
    )
    const newVacDetailActive = {
      ...vacDetailActive,
      vacationDetails: activeDetails,
    }
    console.log('🚀 ~ onDeleteRow ~ newVacDetailActive:', newVacDetailActive)
    setVacDetailActive(newVacDetailActive)
  }

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
              <strong>Días espirados:</strong> <br /> {totalExpiredDays}
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
                  color={vacDetailActive.isActive ? 'success' : 'danger'}
                  size="sm"
                  variant="dot"
                >
                  {vacDetailActive.isActive ? 'Activas' : 'Inactivas'}
                </Chip>
              </Slot>
              <Slot slot="body">
                {/* {JSON.stringify(vacDetailActive)} */}
                <div className="my-3 flex flex-wrap justify-between rounded-md border border-blue-600 px-4 py-2">
                  <div>Acumuladas: {vacDetailActive.accumulatedVacations}</div>
                  <div className="text-2xl font-semibold text-blue-600">
                    <FontAwesomeIcon icon="fa-solid fa-minus" />
                  </div>
                  <div>Tomadas: {vacDetailActive.takenVacations}</div>
                  <div className="text-2xl font-semibold text-blue-600">
                    <FontAwesomeIcon icon="fa-solid fa-equals" />
                  </div>
                  <div>Pendientes: {vacDetailActive.remainingVacations}</div>
                </div>

                {vacDetailActive && (
                  <FormDataWorkerVacation
                    vacationsDetailActive={vacDetailActive.vacationDetails}
                    vacationId={vacDetailActive.id}
                    fetchData={() => {
                      fetchData()
                      getWorkerDetails.refetch()
                    }}
                    onDeleteRow={onDeleteRow}
                  ></FormDataWorkerVacation>
                )}
              </Slot>
            </CardBase>
          )}
        </div>
      )}
    </div>
  )

  // return (
  //   <>
  //     <pre>{JSON.stringify(data)}</pre>
  //   </>
  // )
}
