export function formatTime(millis: number): string {
    const seconds = millis / 1000;
    const d = Math.floor(seconds / 86400); // 60 * 60 * 24
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
}

export function enumNames(enum_: any): string[] {
    return Object.keys(enum_).filter(
        (k) => typeof enum_[k] === 'number' || enum_[k] === k || enum_[enum_[k]]?.toString() !== k
    );
}

export const cropNames = [
    'Cactus',
    'Carrot',
    'Cocoa beans',
    'Melon',
    'Mushroom',
    'Nether wart',
    'Potato',
    'Pumpkin',
    'Sugar cane',
    'Wheat',
];
