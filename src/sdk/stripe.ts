import axios from "axios";
import { getServiceConfig } from "../getServiceConfig";
import ApiVersions from "../Server/versions";
import { RouteCategories } from "../routeCategories";
import { stripeRouterPaths } from "../Routers/stripeRouter";

const { APPLICATION_URL } = getServiceConfig();

const createSubscription = (token: string, id: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.stripe}/${stripeRouterPaths.subscriptions}`,
    { token, id }
  );
};

const deleteSubscription = (subscription: string, id: string) => {
  return axios.post(
    `${APPLICATION_URL}/${ApiVersions.v1}/${RouteCategories.stripe}/${stripeRouterPaths.deleteSubscriptions}`,
    { subscription, id }
  );
};

const stripe = {
  createSubscription,
  deleteSubscription
};

export default stripe;
