export type ZabbixStatus = {
  available: boolean;
  incidents_recent: boolean;
  message: string;
  lastIncidentAt?: string;
};
