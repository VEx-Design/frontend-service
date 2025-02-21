export class BoxConfig{
    height: number = 0;
    width: number = 0;

    constructor(height: number, width: number){
        this.height = height;
        this.width = width;
    }

    updateConfig(height: number, width: number) {
        this.height = height;
        this.width = width;
    }

    getConfig() {
        return {
            height: this.height,
            width: this.width,
        };
    }
}

export class BoxInformation {
    information: Map<string, BoxConfig> = new Map<string, BoxConfig>();
}


