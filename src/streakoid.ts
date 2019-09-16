import {
  streakoidFactory,
  streakoidClientFactory
} from "@streakoid/streakoid-sdk";

import { getServiceConfig } from "./getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

const streakoidClient = streakoidClientFactory(APPLICATION_URL);

export default streakoidFactory(streakoidClient);
