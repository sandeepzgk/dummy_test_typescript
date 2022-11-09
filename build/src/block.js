"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = exports.BlockType = void 0;
//Typescript class for block object
const crypto_1 = __importDefault(require("crypto"));
const bezier_easing_1 = __importDefault(require("bezier-easing"));
var BlockType;
(function (BlockType) {
    BlockType[BlockType["regular_square"] = 0] = "regular_square";
    BlockType[BlockType["regular_sine"] = 1] = "regular_sine";
    BlockType[BlockType["regular_triangle"] = 2] = "regular_triangle";
    BlockType[BlockType["regular_sawtooth"] = 3] = "regular_sawtooth";
    BlockType[BlockType["regular_function"] = 4] = "regular_function";
    BlockType[BlockType["regular_silence"] = 5] = "regular_silence";
    BlockType[BlockType["irregular_custom_wav"] = 6] = "irregular_custom_wav";
    BlockType[BlockType["irregular_noise_pink"] = 7] = "irregular_noise_pink";
    BlockType[BlockType["irregular_noise_white"] = 8] = "irregular_noise_white";
    BlockType[BlockType["irregular_noise_brown"] = 9] = "irregular_noise_brown";
    BlockType[BlockType["irregular_noise_blue"] = 10] = "irregular_noise_blue";
    BlockType[BlockType["irregular_noise_violet"] = 11] = "irregular_noise_violet";
})(BlockType = exports.BlockType || (exports.BlockType = {}));
class Block {
    constructor(blockID) {
        this.blockType = BlockType.regular_sine; // has to be initialized or gives a typescript error. "error TS2564: Property 'blockType' has no initializer and is not definitely assigned in the constructor."
        this.samples = [];
        this.isRegularBlock = false;
        this.duration = 0;
        this.custom_wav = '';
        this.frequency = 0;
        this.phase = 0;
        this.constant_amplitude = 0;
        this.easing_offset = 0;
        this.easing_points = [0, 0, 0, 0];
        this.easing_scale = 0;
        this.sampleRate = 44100;
        this.last_brown = 0;
        this.last_blue = 0;
        this.last_violet = 0;
        this.blockID = crypto_1.default.randomUUID();
    }
    updateBlock(blockType, duration, frequency, phase, constant_amplitude, easing_offset, easing_points, easing_scale, custom_wav) {
        this.blockType = blockType;
        this.duration = duration;
        this.frequency = frequency;
        this.phase = phase;
        this.constant_amplitude = constant_amplitude;
        this.easing_offset = easing_offset;
        this.easing_points = easing_points;
        this.easing_scale = easing_scale;
        this.custom_wav = custom_wav;
    }
    renderSamples() {
        switch (this.blockType) {
            case BlockType.regular_square:
                this.samples = this.renderwave('square');
                break;
            case BlockType.regular_sine:
                this.samples = this.renderwave('sine');
                break;
            case BlockType.regular_triangle:
                this.samples = this.renderwave('triangle');
                break;
            case BlockType.regular_sawtooth:
                this.samples = this.renderwave('sawtooth');
                break;
            case BlockType.regular_function:
                this.samples = this.renderwave('function');
                break;
            case BlockType.regular_silence:
                this.samples = this.renderwave('silence');
                break;
            case BlockType.irregular_custom_wav:
                this.samples = this.renderwave('custom_wav');
                break;
            case BlockType.irregular_noise_pink:
                this.samples = this.renderwave('pink');
                break;
            case BlockType.irregular_noise_white:
                this.samples = this.renderwave('white');
                break;
            case BlockType.irregular_noise_brown:
                this.samples = this.renderwave('brown');
                break;
            case BlockType.irregular_noise_blue:
                this.samples = this.renderwave('blue');
                break;
            case BlockType.irregular_noise_violet:
                this.samples = this.renderwave('violet');
                break;
            default:
                break;
        }
    }
    renderwave(wavetype) {
        const samples = [];
        const phase = this.phase;
        const amplitude = this.constant_amplitude;
        const duration = this.duration;
        const sample_rate = this.sampleRate;
        const frequency = this.frequency;
        const easing_offset = this.easing_offset;
        const easing_scale = this.easing_scale;
        const easing_points = this.easing_points;
        const easing = (0, bezier_easing_1.default)(easing_points[0], easing_points[1], easing_points[2], easing_points[3]);
        const sample_count = duration * sample_rate;
        const sample_period = 1 / sample_rate;
        let sample_index = 0;
        let sample_time = 0;
        let sample_value = 0;
        let sample_easing = 0;
        let sample_amplitude = 0;
        for (sample_index = 0; sample_index < sample_count; sample_index++) {
            sample_time = sample_index * sample_period;
            sample_easing = easing(sample_time / duration);
            sample_amplitude = amplitude * sample_easing;
            sample_value = 0;
            switch (wavetype) {
                case 'sine':
                    sample_value = Math.sin(2 * Math.PI * frequency * sample_time + phase);
                    break;
                case 'square':
                    sample_value = Math.sign(Math.sin(2 * Math.PI * frequency * sample_time + phase));
                    break;
                case 'sawtooth':
                    sample_value = 2 * ((sample_time * frequency) % 1) - 1;
                    break;
                case 'triangle':
                    sample_value = Math.abs(4 * ((sample_time * frequency) % 1) - 2) - 1;
                    break;
                case 'silence':
                    sample_value = 0;
                    break;
                case 'function':
                    sample_value = this.renderFunction(sample_time);
                    break;
                case 'pink':
                    sample_value = this.renderNoisePink();
                    break;
                case 'white':
                    sample_value = this.renderNoiseWhite();
                    break;
                case 'brown':
                    sample_value = this.renderNoiseBrown();
                    break;
                case 'blue':
                    sample_value = this.renderNoiseBlue();
                    break;
                case 'violet':
                    sample_value = this.renderNoiseViolet();
                    break;
                default:
                    break;
            }
            samples.push(sample_value * sample_amplitude);
        }
        return samples;
    }
    renderFunction(sample_time) {
        let sample_value = 0;
        try {
            // sample_value = eval(this.function_string);
        }
        catch (error) {
            sample_value = 0;
        }
        return sample_value;
    }
    renderNoisePink() {
        let sample_value = 0;
        let b0, b1, b2, b3, b4, b5, b6;
        b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.969 * b2 + white * 0.153852;
        b3 = 0.8665 * b3 + white * 0.3104856;
        b4 = 0.55 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.016898;
        sample_value = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        sample_value *= 0.11;
        return sample_value;
    }
    renderNoiseWhite() {
        let sample_value = 0;
        sample_value = Math.random() * 2 - 1;
        return sample_value;
    }
    renderNoiseBrown() {
        let sample_value = 0;
        const white = Math.random() * 2 - 1;
        sample_value = this.last_brown + 0.02 * white;
        sample_value /= 1.02;
        this.last_brown = sample_value;
        return sample_value;
    }
    renderNoiseBlue() {
        let sample_value = 0;
        const white = Math.random() * 2 - 1;
        sample_value = this.last_blue + 0.005 * white;
        sample_value /= 1.005;
        this.last_blue = sample_value;
        return sample_value;
    }
    renderNoiseViolet() {
        let sample_value = 0;
        const white = Math.random() * 2 - 1;
        sample_value = this.last_violet + 0.001 * white;
        sample_value /= 1.001;
        this.last_violet = sample_value;
        return sample_value;
    }
}
exports.Block = Block;
//# sourceMappingURL=block.js.map