import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";

const { APPLICATION_URL } = getServiceConfig();

const deleteOne = (completeTaskId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.agendaJobs}/${completeTaskId}`
  );
};

const agendaJobs = {
  deleteOne
};

export default agendaJobs;
