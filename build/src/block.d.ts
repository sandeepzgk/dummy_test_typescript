export declare enum BlockType {
    regular_square = 0,
    regular_sine = 1,
    regular_triangle = 2,
    regular_sawtooth = 3,
    regular_function = 4,
    regular_silence = 5,
    irregular_custom_wav = 6,
    irregular_noise_pink = 7,
    irregular_noise_white = 8,
    irregular_noise_brown = 9,
    irregular_noise_blue = 10,
    irregular_noise_violet = 11
}
export declare class Block {
    private blockType;
    private blockID;
    private samples;
    private isRegularBlock;
    private duration;
    private custom_wav;
    private frequency;
    private phase;
    private constant_amplitude;
    private easing_offset;
    private easing_points;
    private easing_scale;
    private sampleRate;
    private last_brown;
    private last_blue;
    private last_violet;
    constructor(blockID: string);
    updateBlock(blockType: BlockType, duration: number, frequency: number, phase: number, constant_amplitude: number, easing_offset: number, easing_points: number[], easing_scale: number, custom_wav: string): void;
    private renderSamples;
    private renderwave;
    private renderFunction;
    private renderNoisePink;
    private renderNoiseWhite;
    private renderNoiseBrown;
    private renderNoiseBlue;
    private renderNoiseViolet;
}
