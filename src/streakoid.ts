import streakoidFactory from "@streakoid/streakoid-sdk";
import { getServiceConfig } from "./getServiceConfig";
const { APPLICATION_URL } = getServiceConfig();

export default streakoidFactory(APPLICATION_URL);
