import tape from "tape";
import fs from "fs/promises";
import * as url from "url";
import path from "path";

import * as common from "../lib/common.js";
import { encode, decode } from "../index.js";
import { decode as decodeWAV } from "wav-decoder";
import { readdirSync } from "fs";
import toWav from "audiobuffer-to-wav";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const inDir = path.resolve(__dirname, "fixtures");
const files = readdirSync(inDir).filter(
  (f) => /\.wav$/i.test(f) && !/\.qoa\.wav/i.test(f)
);

for (let file of files) {
  console.log("Encoding", file);

  const input = await fs.readFile(path.resolve(inDir, file));
  const { channelData, sampleRate } = await decodeWAV(input);

  const encoded = encode({ channelData, sampleRate });

  const qoaFile = path.basename(file, path.extname(file)) + ".qoa";
  const outputQOA = path.resolve(inDir, qoaFile);
  await fs.writeFile(outputQOA, Buffer.from(encoded));

  console.log("Decoding", qoaFile);
  const audio = decode(encoded);

  const audioBuffer = {
    numberOfChannels: audio.channels,
    sampleRate: audio.sampleRate,
    getChannelData(index) {
      return audio.channelData[index];
    },
  };
  const reEncoded = toWav(audioBuffer);
  console.log("Writing WAV encoding after conversion");
  const outFile = path.resolve(inDir, qoaFile + ".wav");
  await fs.writeFile(outFile, Buffer.from(reEncoded));
}
