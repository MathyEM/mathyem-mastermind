import dotenv from 'dotenv';
dotenv.config();

export default class ConfigProvider {
  static get CONFIG() {
    return {
      socketEndpoint: "$VUE_APP_SOCKET_ENDPOINT",
      socketEndpointProtocol: "$VUE_APP_SOCKET_ENDPOINT_PROTOCOL",
      publicVapidKey: "$VUE_APP_PUBLIC_VAPID_KEY",
    };
  }

  static value(name) {
    if (!(name in this.CONFIG)) {
      return;
    }

    const value = this.CONFIG[name];

    if (!value) {
      return;
    }

    if (value.startsWith('$VUE_APP_')) {
      const envName = value.substr(1);
      const envValue = process.env[envName];
      if (envValue) {
        return envValue;
      } else {
        return
      }
    } else {
      return value;
    }
  }
}