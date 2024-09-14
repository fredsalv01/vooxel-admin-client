import React, { useEffect, useMemo, useState } from 'react'
import { Button, Chip, useDisclosure } from '@nextui-org/react'

import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  EditWorkerModal,
  EditCreateEmergencyContact,
  FilesWorkers,
  EditCreateBankAccount,
  GridHabilities,
} from '../components'
import { EditCreateContractWorker } from '../components/EditCreateContractWorker'
import { EditCreateCertification } from '../components/EditCreateCertification'
import { useWorker } from '../hooks/useWorker'
import { CardBase } from '../../../components/base'
import { GridDetailInfo } from '../../../components/GridDetailInfo'

export const WorkerDetailPage = () => {
  const { id } = useParams()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  // const { loading, data, fetchData } = useFetchData({ url: `/workers/${id}` });

  const { getWorkerDetails } = useWorker(id)

  const detailWorker = useMemo(() => {
    if (!!getWorkerDetails.data) {
      const data = getWorkerDetails.data
      return {
        Nombre: data.name,
        'Apellido Pat': data.apPat,
        'Apellido Mat': data.apMat,
        'Fecha inicio de trabajo': data.startDate,
        Cumpleaños: data.birthdate,
        'Tipo de documento': data.documentType,
        'Nro documento': data.documentNumber,
        Cargo: data.charge,
        Seniority: data.seniority,
        'Nivel de Ingles': data.englishLevel,
        Celular: data.phoneNumber,
        Correo: data.email,
        Dirección: data.address,
        Distrito: data.district,
        Provincia: data.province,
        Departamento: data.department,
        Asignación: data.familiarAssignment,
        Habilidades: data.techSkills && (
          <GridHabilities items={data.techSkills} />
        ),
        Estado: (
          <Chip
            className="gap-1 border-none capitalize text-default-600"
            color={data.isActive ? 'success' : 'danger'}
            size="md"
            variant="dot"
          >
            {data.isActive ? 'Activo' : 'Inactivo'}
          </Chip>
        ),
      }
    }
  }, [getWorkerDetails])

  return (
    <div className="container bg-blue-100 p-4">
      {isOpen && (
        <EditWorkerModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          editItem={getWorkerDetails.data}
          fetchData={getWorkerDetails.refetch}
        />
      )}

      <div className="flex flex-wrap justify-between">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="flex-1 text-2xl font-semibold">
            Perfil del colaborador
          </h2>
          <Button
            onPress={onOpen}
            color="warning"
            className="mb-0"
            isDisabled={
              getWorkerDetails.isLoading || getWorkerDetails.isFetching
            }
          >
            Editar
          </Button>
        </div>
        <Button as={Link} to={`/workers`} color="secondary">
          Regresar
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CardBase
          async={getWorkerDetails.isLoading || getWorkerDetails.isFetching}
        >
          <GridDetailInfo data={detailWorker} />
        </CardBase>

        <EditCreateContractWorker
          itemId={id}
          reFetchData={getWorkerDetails.refetch}
        />
        <EditCreateBankAccount itemId={id} />
        {getWorkerDetails.data && (
          <FilesWorkers
            itemId={id}
            filesCount={getWorkerDetails.data.filesCount || {}}
            fetchData={getWorkerDetails.refetch}
          />
        )}
        <EditCreateCertification
          itemId={id}
          reFetchData={getWorkerDetails.refetch}
        />
        <EditCreateEmergencyContact itemId={id} />
      </div>
    </div>
  )
}
