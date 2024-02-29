import { BaseConfig } from "./type";


class virtualAxios {
  private instance: any
  private config: BaseConfig
  constructor(axios: any, config: BaseConfig) {
    this.instance = axios;
    this.config = config
  }
}

export { virtualAxios };
