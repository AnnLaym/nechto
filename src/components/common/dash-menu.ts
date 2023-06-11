export interface DashMenuButton {
    icon: string;
    onClick: () => void;
}

export interface DashMenuNumberSetting {
    icon: string;
    min?: number;
    max?: number;
    originalValue: number;
    onChange(value: number): void;
}
