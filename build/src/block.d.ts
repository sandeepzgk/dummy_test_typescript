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
    private block_type;
    private block_id;
    private samples;
    private duration;
    private custom_wav;
    private frequency;
    private phase;
    private constant_amplitude;
    private easing_offset;
    private easing_points;
    private easing_scale;
    private static readonly sample_rate;
    private static readonly bit_depth;
    private static readonly max_value;
    private last_brown;
    private last_blue;
    private last_violet;
    constructor();
    updateBlock(block_type: BlockType, duration: number, frequency: number, phase: number, constant_amplitude: number, easing_offset: number, easing_points: number[], easing_scale: number, custom_wav: string): void;
    private renderSamples;
    private renderwave;
    private renderFunction;
    private renderNoisePink;
    private renderNoiseWhite;
    private renderNoiseBrown;
    private renderNoiseBlue;
    private renderNoiseViolet;
    /**
      private renderNoiseRed() {
        var sample_value: number = 0;
        var white: number = Math.random() * 2 - 1;
        sample_value = this.last_red + (0.02 * white);
        sample_value /= 1.02;
        this.last_red = sample_value;
        return sample_value;
      }
  
      private renderNoiseGreen() {
        var sample_value: number = 0;
        var white: number = Math.random() * 2 - 1;
        sample_value = this.last_green + (0.005 * white);
        sample_value /= 1.005;
        this.last_green = sample_value;
        return sample_value;
      }
  
      private renderNoiseYellow() {
  
        var sample_value: number = 0;
        var white: number = Math.random() * 2 - 1;
        sample_value = this.last_yellow + (0.001 * white);
        sample_value /= 1.001;
        this.last_yellow = sample_value;
        return sample_value;
  
      }
  
      private renderNoiseGrey() {
  
        var sample_value: number = 0;
        var white: number = Math.random() * 2 - 1;
        sample_value = this.last_grey + (0.001 * white);
        sample_value /= 1.001;
        this.last_grey = sample_value;
        return sample_value;
  
      }
  
      */
    writeWav(file_name: string): void;
}
