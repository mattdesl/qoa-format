import fs from "fs/promises";
import path from "path";
import minimist from "minimist";
import { decode as decodeWAV } from "wav-decoder";
import { decode, encode } from "../index.js";
import encodeWAV from "audiobuffer-to-wav";

const argv = minimist(process.argv.slice(2));

if (argv._.length !== 2)
  throw new Error(
    "invalid arguments, usage:\n  node cli.js input.{qoa,wav} output.{qoa,wav}"
  );

const input = argv._[0];
const output = argv._[1];
run(input, output);

async function run(input, output) {
  const inFormat = path.extname(input).toLowerCase();
  const outFormat = path.extname(output).toLowerCase();

  const formats = [".qoa", ".wav"];

  if (inFormat === outFormat)
    throw new Error(`in and out formats are the same`);
  if (!formats.includes(inFormat) || !formats.includes(outFormat))
    throw new Error("formats must be .wav or .qoa");

  const inbuf = await fs.readFile(input);
  let outbuf, audio;

  if (inFormat == ".qoa") {
    // decode QOA and encode WAV
    audio = decode(inbuf);

    // mimic webaudio buffer
    const audioBuffer = {
      numberOfChannels: audio.channelData.length,
      sampleRate: audio.sampleRate,
      getChannelData(index) {
        return audio.channelData[index];
      },
    };

    const arrayBuf = encodeWAV(audioBuffer);
    outbuf = new Uint8Array(arrayBuf);
  } else {
    // decode WAV and encode QOA
    audio = await decodeWAV(inbuf);
    outbuf = encode(audio);
  }

  const { channelData, sampleRate } = audio;
  const samples = channelData.length ? channelData[0].length : 0;
  const channels = channelData.length;
  console.log("Channels:", channels);
  console.log("Sample Rate:", sampleRate, "Hz");
  console.log("Samples:", samples);
  console.log("Duration:", (samples / sampleRate).toFixed(2), "sec");

  if (outbuf) {
    console.log("Writing:", output);
    await fs.writeFile(output, outbuf);
  }
}
