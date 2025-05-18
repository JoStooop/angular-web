interface Config {
    isProduction: boolean;
    environment: 'DEV' | 'PROD';
    apiUrl: string
}

export class AppGlobalConfig {
    isProduction: boolean
    environment: 'DEV' | 'PROD'
    apiUrl: string

    constructor(config: Config) {
        this.isProduction = config.isProduction;
        this.environment = config.environment;
        this.apiUrl = config.apiUrl;
    }

    private getEndpoint(endpointPart: string): string {
        return `${this.apiUrl}${endpointPart}`;
    }

    get postsEndpoint(): string {
        return this.getEndpoint('/posts');
    }
    // А почему сразу не вызывать getEndpoint и передавать эндпоинт?
}
