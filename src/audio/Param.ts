
interface ParamOptions {
    default: number;
    min: number;
    max: number;
    step?: number;
    scale?: "log2" | "linear" 
}

export class Param {
    normalized: number;
    value: number;

    min: number;
    max: number;

    step: number;

    param: AudioParam | undefined;

    onChange: () => void;

    scale: "log2" | "linear";

    constructor(options: ParamOptions, onChange: () => void) {
        this.value = options.default;
        this.normalized = this.normalizedFromValue(this.value);
        this.min = options.min;
        this.max = options.max;

        this.step = options.step ?? 1;

        this.scale = options.scale ?? "linear";

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
        this.value = this.valueFromNormalized(this.normalized);
        this.updateParam();
        this.onChange();
    }

    normalizedFromValue(value: number): number {

        if(this.scale === "log2") {
            return ((Math.log(value/this.max) / Math.LN2) / Math.log2(this.max / this.min) + 1) * 127
        }

        return (value - this.min) / (this.max - this.min)
    }

    valueFromNormalized(normalized: number): number {
        if(this.scale === "log2") {
            return this.max * Math.pow(2, Math.log2(this.max / this.min) * (normalized - 1.0))
        }

        return this.min + (normalized * (this.max - this.min))
    }
    connect(param: AudioParam) {
        this.param = param;
        this.updateParam();
    }

    updateParam() {

        console.log(this.normalized, this.value)

        if (!this.param) {
            return;
        }
        this.param.setValueAtTime(this.value, 0)
    }
}