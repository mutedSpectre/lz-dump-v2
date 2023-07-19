import { MessageOrigin } from './packet';
export type PrecrimeConfigV1 = {
    version: number;
    maxBatchSize: number;
    remoteEids: number[];
    remoteAddresses: string[];
};
export type PrecrimeConfig = PrecrimeConfigV1;
export type PrecrimePacket = {
    origin: MessageOrigin;
    guid: string;
    message: string;
    callParams: string;
};
//# sourceMappingURL=precrime.d.ts.map