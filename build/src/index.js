"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_1 = require("./block");
const block = new block_1.Block();
block.updateBlock(block_1.BlockType.irregular_noise_white, 1, 440, 0, 2147483647, 0, [0, 0, 0, 0], 0, '');
block.writeWav('testfile.wav');
//# sourceMappingURL=index.js.map