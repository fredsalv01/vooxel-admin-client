import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useFetchData } from '../../../hooks/useFetchData'
import { Button, Chip, useDisclosure } from '@nextui-org/react'
import {
  EditClientModal,
  EditCreateContractClient,
  EditCreateContactClient,
} from '../components'
import { CardBase } from '../../../components/base'
import { GridDetailInfo } from '../../../components/GridDetailInfo'

export const ClientDetailPage = () => {
  const { id } = useParams()
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { loading, data, fetchData } = useFetchData({ url: `/clients/${id}` })

  const detailClient = useMemo(() => {
    if (!!data) {
      return {
        Nombre: data.businessName,
        'Razón social': data.businessName,
        RUC: data.ruc,
        Celular: data.phone,
        Dirección: data?.address,
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
  }, [data])
  return (
    <div
      className="container bg-blue-100 p-4"
      style={{ minHeight: 'calc(100vh - 100px)' }}
    >
      {isOpen && (
        <EditClientModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          editItem={data}
          fetchData={fetchData}
        />
      )}

      <div className="flex flex-wrap justify-between">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="flex-1 text-2xl font-semibold">Perfil del cliente</h2>
          <Button
            onPress={onOpen}
            color="warning"
            className="mb-0"
            isDisabled={
              loading || (data && data.isLoading) || (data && data.isFetching)
            }
          >
            Editar
          </Button>
        </div>

        <div>
          <Button as={Link} to={'/clients'} color="secondary">
            Regresar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <CardBase async={loading}>
          <GridDetailInfo data={detailClient} />
        </CardBase>

        <EditCreateContractClient itemId={id} />

        <EditCreateContactClient itemId={id} />
      </div>
    </div>
  )
}
