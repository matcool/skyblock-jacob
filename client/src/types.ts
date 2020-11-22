export interface Note {
    title: string;
    content: string;
}

export enum Crop {
    Cactus,
    Carrot,
    CocoaBeans,
    Melon,
    Mushroom,
    NetherWart,
    Potato,
    Pumpkin,
    SugarCane,
    Wheat,
}

export interface JacobEvent {
    crops: [Crop, Crop, Crop];
    timestamp: number;
}
