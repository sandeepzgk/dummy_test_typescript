import { Block, BlockType } from './block';

const block = new Block();

block.updateBlock(BlockType.regular_sine, 1, 440, 0, -1, 0, [1, 0, 0, 0], 0, '');
block.writeWav('testfile.wav');
