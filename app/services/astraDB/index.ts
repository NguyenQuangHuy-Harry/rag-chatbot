const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
} = process.env;

export const astraDBConfigs = {
  token: ASTRA_DB_APPLICATION_TOKEN || "",
  endpoint: ASTRA_DB_API_ENDPOINT || "",
  namespace: ASTRA_DB_NAMESPACE || "",
  collection: "PageflyHelpCenter",
};
