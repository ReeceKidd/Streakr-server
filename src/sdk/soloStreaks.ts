import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { SupportedRequestHeaders } from "../Server/headers";

const getAll = ({
  userId,
  completedToday,
  timezone,
  active
}: {
  userId?: string;
  completedToday?: boolean;
  timezone?: string;
  active?: boolean;
}) => {
  let getAllSoloStreaksURL = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}?`;
  if (userId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}userId=${userId}&`;
  }
  if (completedToday) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}completedToday=${completedToday}&`;
  }
  if (timezone) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}timezone=${timezone}`;
  }
  if (active) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}active=${active}`;
  }
  return axios.get(getAllSoloStreaksURL);
};

const getOne = (soloStreakId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
  );
};

const create = (
  userId: string,
  name: string,
  description: string,
  timezone: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}`,
    { userId, name, description },
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const update = (
  soloStreakId: string,
  timezone: string,
  data?: {
    name?: string;
    description?: string;
    active?: boolean;
    currentStreak?: { startDate?: Date; numberOfDaysInARow?: number };
    pastStreaks?: [
      {
        startDate: Date;
        numberOfDaysInARow: number;
        endDate: Date;
      }
    ];
    activity?: { type: string; time: Date }[];
  }
) => {
  return axios.patch(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`,
    data,
    { headers: { [SupportedRequestHeaders.xTimezone]: timezone } }
  );
};

const deleteOne = (soloStreakId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.soloStreaks}/${soloStreakId}`
  );
};

const soloStreaks = {
  getAll,
  getOne,
  deleteOne,
  create,
  update
};

export default soloStreaks;
