import {AppGlobalConfig} from "./appConfig.model";

export const AppConfig = new AppGlobalConfig({
    isProduction: false,
    environment: 'DEV',
    apiUrl: 'https://jsonplaceholder.typicode.com'
})
