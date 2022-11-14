//Typescript class for block object
import crypto from 'crypto';
import bezierEasing from 'bezier-easing';
import { WaveFile } from 'wavefile';
import * as fs from 'fs';
import * as path from 'path';

export enum BlockType {
  regular_square,
  regular_sine,
  regular_triangle,
  regular_sawtooth,
  regular_function,
  regular_silence,
  irregular_custom_wav,
  irregular_noise_pink,
  irregular_noise_white,
  irregular_noise_brown,
  irregular_noise_blue,
  irregular_noise_violet,
}

export class Block {
  private block_type: BlockType = BlockType.regular_sine; // has to be initialized or gives a typescript error. "error TS2564: Property 'blockType' has no initializer and is not definitely assigned in the constructor."
  private block_id: string;
  private samples: number[] = [];
  private duration = 0;
  private custom_wav = '';
  private frequency = 0;
  private phase = 0;
  private constant_amplitude = -1; // default to negative 1 (-1), negative 1 implies easing is used
  private easing_offset = 0;
  private easing_points: number[] = [0, 0, 0, 0];
  private easing_scale = 0;
  private static readonly sample_rate = 44100;
  private static readonly bit_depth: number = 32;
  private static readonly max_value: number = 2 ** (Block.bit_depth - 1) - 1;
  private last_brown = 0;
  private last_blue = 0;
  private last_violet = 0;

  constructor() {
    this.block_id = crypto.randomUUID();
    console.log(Block.max_value);
  }

  public updateBlock(
    block_type: BlockType,
    duration: number,
    frequency: number,
    phase: number,
    constant_amplitude: number,
    easing_offset: number,
    easing_points: number[],
    easing_scale: number,
    custom_wav: string
  ) {
    this.block_type = block_type;
    this.duration = duration;
    this.frequency = frequency;
    this.phase = phase;
    this.constant_amplitude = constant_amplitude;
    this.easing_offset = easing_offset;
    this.easing_points = easing_points;
    this.easing_scale = easing_scale;
    this.custom_wav = custom_wav;

    this.renderSamples();
  }

  private renderSamples() {
    switch (this.block_type) {
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

  private renderwave(wavetype: string) {
    const samples: number[] = [];
    const phase: number = this.phase;
    const amplitude: number = this.constant_amplitude;
    const duration: number = this.duration;
    const sample_rate: number = Block.sample_rate;
    const frequency: number = this.frequency;
    const easing_offset: number = this.easing_offset;
    const easing_scale: number = this.easing_scale;
    const easing_points = this.easing_points;
    const easing = bezierEasing(
      easing_points[0],
      easing_points[1],
      easing_points[2],
      easing_points[3]
    );
    const sample_count: number = duration * sample_rate;
    const sample_period: number = 1 / sample_rate;
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
          sample_value = Math.sin(
            2 * Math.PI * frequency * sample_time + phase
          );
          break;
        case 'square':
          sample_value = Math.sign(
            Math.sin(2 * Math.PI * frequency * sample_time + phase)
          );
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

      if (this.constant_amplitude === -1) {
        // if amplitude is set to -1, then the amplitude is set to the easing value
        samples.push(sample_value * sample_amplitude);
      } else {
        //since amplitude is not -1, then the scale is set to constant amplitude
        samples.push(sample_value * this.constant_amplitude);
      }
    }

    return samples;
  }

  private renderFunction(sample_time: number) {
    let sample_value = 0;
    try {
      // sample_value = eval(this.function_string);
    } catch (error) {
      sample_value = 0;
    }
    return sample_value;
  }

  private renderNoisePink() {
    let sample_value = 0;
    let b0, b1, b2, b3, b4, b5, b6: number;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    const white: number = Math.random() * 2 - 1;
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

  private renderNoiseWhite() {
    let sample_value = 0;
    sample_value = Math.random() * 2 - 1;
    return sample_value;
  }

  private renderNoiseBrown() {
    let sample_value = 0;
    const white: number = Math.random() * 2 - 1;
    sample_value = this.last_brown + 0.02 * white;
    sample_value /= 1.02;
    this.last_brown = sample_value;
    return sample_value;
  }

  private renderNoiseBlue() {
    let sample_value = 0;
    const white: number = Math.random() * 2 - 1;
    sample_value = this.last_blue + 0.005 * white;
    sample_value /= 1.005;
    this.last_blue = sample_value;
    return sample_value;
  }

  private renderNoiseViolet() {
    let sample_value = 0;
    const white: number = Math.random() * 2 - 1;
    sample_value = this.last_violet + 0.001 * white;
    sample_value /= 1.001;
    this.last_violet = sample_value;
    return sample_value;
  }
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
  // write samples to wav file
  public writeWav(file_name: string) {
    const wav = new WaveFile();

    // Create a mono wave file, 44.1 kHz, 32-bit and 4 samples
    wav.fromScratch(
      1,
      Block.sample_rate,
      String(Block.bit_depth),
      this.samples
    );
    fs.writeFileSync(file_name, wav.toBuffer());
  }
}
