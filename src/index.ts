import { Block, BlockType } from './block';

const block = new Block();

block.updateBlock(BlockType.irregular_noise_white, 1, 440, 0, 2147483647, 0, [0, 0, 0, 0], 0, '');
block.writeWav('testfile.wav');
