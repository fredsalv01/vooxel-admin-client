import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CardBase } from "../../../components/base";
import { Chip } from "@nextui-org/react";
import { FormDataWorkerVacation } from "../components";
import Slot from "../../../components/Slot";

import { useFetchData } from "../../../hooks/useFetchData";
import { useWorker } from "../hooks/useWorker";

export const WorkerVacationsPage = () => {
  const { id: worderId } = useParams();

  const [vacDetailActive, setVacDetailActive] = useState({});
  // const [vacDetailInactive, setVacDetailInactive] = useState([]);
  const [totalExpiredDays, setTotalExpiredDays] = useState(0);

  const { data: vacationsWorker, fetchData } = useFetchData({
    url: `vacations/workerId/${worderId}`,
  });

  const { getWorkerDetails } = useWorker(worderId);

  // const [historyData, sethistoryData] = useState([]);

  useEffect(() => {
    if (!!vacationsWorker) {
      // const { arrVacDetailActive, arrVacDetailInactive } =
      //   vacationsWorker.reduce(
      //     (acc, item) => {
      //       if (vacDetailActive.isActive) {
      //         const details = vacDetailActive.vacationDetails.map((detail) => {
      //           return {
      //             days: detail.quantity,
      //             ...detail,
      //           };
      //         });

      //         vacDetailActive.vacationDetails = details;

      //         acc.arrVacDetailActive.push(item);
      //       } else {
      //         acc.arrVacDetailInactive.push(item);
      //       }
      //       return acc;
      //     },
      //     { arrVacDetailActive: [], arrVacDetailInactive: [] },
      //   );

      setVacDetailActive(vacationsWorker);
      setTotalExpiredDays(vacationsWorker.expiredDays);
      // setVacDetailInactive([...arrVacDetailInactive]);

      // if (arrVacDetailActive.length > 0) {
      //   const total = arrVacDetailActive.reduce((acc, item) => {
      //     return (acc += vacDetailActive.expiredDays);
      //   }, 0);

      //   setTotalExpiredDays(total);
      // }
    }
  }, [vacationsWorker]);

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
              <strong>Fecha de inicio de trabajo:</strong> <br />{" "}
              {getWorkerDetails.data?.startDate}
            </p>

            <p className="text-xl">
              <strong>Días espirados:</strong> <br /> {totalExpiredDays}
            </p>
          </div>

          <CardBase title="Vacaciones">
            <Slot slot="header">
              <Chip
                className="gap-1 border-none capitalize text-default-600"
                color={vacDetailActive.isActive ? "success" : "danger"}
                size="sm"
                variant="dot"
              >
                {vacDetailActive.isActive ? "Activas" : "Inactivas"}
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
                    fetchData();
                    getWorkerDetails.refetch();
                  }}
                ></FormDataWorkerVacation>
              )}
            </Slot>
          </CardBase>
        </div>
      )}
    </div>
  );

  // return (
  //   <>
  //     <pre>{JSON.stringify(data)}</pre>
  //   </>
  // )
};
