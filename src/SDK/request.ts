/* eslint-disable @typescript-eslint/no-explicit-any */
export type GetRequest = ({ route }: { route: string }) => Promise<any>;

export type PostRequest = ({ route, params }: { route: string; params: any }) => Promise<any>;

export type PatchRequest = ({ route, params }: { route: string; params?: any }) => Promise<any>;

export type DeleteRequest = ({ route }: { route: string }) => Promise<any>;
