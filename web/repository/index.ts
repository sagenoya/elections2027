import ForecastModule from "./modules/forecast";

const DATA_URL = process.env.NEXT_PUBLIC_DATA_URL ?? "/data";

class Repository {
  forecast = new ForecastModule(DATA_URL);
}

export const $api = new Repository();
export { ApiError } from "./factory";
