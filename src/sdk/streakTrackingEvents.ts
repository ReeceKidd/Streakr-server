import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { StreakTrackingEventType } from "../Models/StreakTrackingEvent";

const getAll = ({
  type,
  userId,
  streakId
}: {
  type?: string;
  userId?: string;
  streakId?: string;
}) => {
  let getAllSoloStreaksURL = `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.streakTrackingEvents}?`;

  if (type) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}type=${type}&`;
  }
  if (userId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}userId=${userId}&`;
  }
  if (streakId) {
    getAllSoloStreaksURL = `${getAllSoloStreaksURL}streakId=${streakId}`;
  }
  return axios.get(getAllSoloStreaksURL);
};

const getOne = (streakTrackingEventId: string) => {
  return axios.get(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.streakTrackingEvents}/${streakTrackingEventId}`
  );
};

const create = (
  type: StreakTrackingEventType,
  streakId: string,
  userId: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.streakTrackingEvents}`,
    { type, streakId, userId }
  );
};

const deleteOne = (streakTrackingEventId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.streakTrackingEvents}/${streakTrackingEventId}`
  );
};

const streakTrackingEvents = {
  getAll,
  getOne,
  create,
  deleteOne
};

export default streakTrackingEvents;
