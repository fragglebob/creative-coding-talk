
interface ParamOptions {
    default: number;
    min: number;
    max: number;
    step?: number;
}

export class Param {
    normalized: number;
    value: number;

    min: number;
    max: number;

    step: number;

    param: AudioParam | undefined;

    onChange: () => void;

    constructor(options: ParamOptions, onChange: () => void) {
        this.value = options.default;
        this.normalized = this.normalizedFromValue(this.value);
        this.min = options.min;
        this.max = options.max;

        this.step = options.step ?? 1;

        this.onChange = onChange;
    }

    setValue(value: number) {
        this.value = Math.max(Math.min(value, this.max), this.min);
        this.normalized = this.normalizedFromValue(this.value);
        this.updateParam();
        this.onChange();
    }

    setNormalized(normalized: number) {
        this.normalized = Math.max(Math.min(normalized, 1), 0);
        this.value = this.valueFromNormalized(this.value);
        this.updateParam();
        this.onChange();
    }

    normalizedFromValue(value: number): number {
        return (value - this.min) / (this.max - this.min)
    }

    valueFromNormalized(normalized: number): number {
        return this.min + (normalized * (this.max - this.min))
    }
    connect(param: AudioParam) {
        this.param = param;
        this.updateParam();
    }

    updateParam() {
        if (!this.param) {
            return;
        }
        this.param.setValueAtTime(this.value, 0)
    }
}