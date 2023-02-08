import fs from "fs/promises";
import path from "path";
import { decode, encode } from "../index.js";
import { decode as decodeWAV } from "wav-decoder";
import encodeWAVBuffer from "audiobuffer-to-wav";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const sampleRate = 44100;
const amplitude = 0.2;
const seconds = 0.5;
const tone = 441; // A

const samples = Math.ceil(seconds * sampleRate);
const sampleData = new Float32Array(samples);
for (let i = 0; i < samples; i++) {
  sampleData[i] = sineWaveAt(i, tone, sampleRate) * amplitude;
}

// audio descriptor
const audio = {
  sampleRate,
  channelData: [sampleData],
};

const wav = encodeWAV(audio);

const qoa = encode(audio);
const converted = decode(qoa);
const convertedWav = encodeWAV(converted);

await fs.writeFile(path.resolve(__dirname, "fixtures/sine.qoa"), qoa);
await fs.writeFile(path.resolve(__dirname, "fixtures/sine.wav"), wav);
await fs.writeFile(
  path.resolve(__dirname, "fixtures/sine-qoa.wav"),
  convertedWav
);

function sineWaveAt(sampleIndex, tone, sampleRate) {
  var sampleFreq = sampleRate / tone;
  return Math.sin(sampleIndex / (sampleFreq / (Math.PI * 2)));
}

function encodeWAV(audio) {
  const audioBuffer = {
    numberOfChannels: audio.channelData.length,
    sampleRate: audio.sampleRate,
    getChannelData(index) {
      return audio.channelData[index];
    },
  };
  return new Uint8Array(encodeWAVBuffer(audioBuffer));
}
