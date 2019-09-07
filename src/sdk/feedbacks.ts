import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";

const { APPLICATION_URL } = getServiceConfig();

const create = (
  userId: string,
  pageUrl: string,
  username: string,
  userEmail: string,
  feedback: string
) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.feedbacks}`,
    {
      userId,
      pageUrl,
      username,
      userEmail,
      feedback
    }
  );
};

const deleteOne = (feedbackId: string) => {
  return axios.delete(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.feedbacks}/${feedbackId}`
  );
};

const feedbacks = {
  create,
  deleteOne
};

export default feedbacks;
