import tape from "tape";
import fs from "fs/promises";
import * as url from "url";
import path from "path";

import * as common from "../lib/common.js";
import { encode, decode } from "../index.js";
import { decode as decodeWAV } from "wav-decoder";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

tape("should decode", async (t) => {
  // TODO: How best to test?
  // const input = await fs.readFile(
  //   path.resolve(__dirname, "fixtures/sting_banjo_humorous_02.qoa")
  // );
  // const output = await fs.readFile(
  //   path.resolve(__dirname, "fixtures/sting_banjo_humorous_02-qoa.wav")
  // );
  // const input2WAV = await fs.readFile(
  //   path.resolve(__dirname, "fixtures/sting_banjo_humorous_02.wav")
  // );
  // const expected02QOA = input;
  // const audioWAVInput = await decodeWAV(input2WAV);
  // const sampleRate = 44100;
  // const audioInfo = {
  //   samples: sampleRate,
  //   sampleRate,
  //   channels: 1,
  //   channelData: [new Float32Array(sampleRate)],
  // };
  // t.doesNotThrow(() => encode(audioWAVInput));
  // const encoded = encode(audioWAVInput);
  // t.ok(
  //   Buffer.from(new Uint8Array(encoded)).equals(expected02QOA),
  //   "files match"
  // );
  // t.doesNotThrow(() => decode(new Uint8Array(encoded)));
  // t.doesNotThrow(() => decode(input));
  // const expected = await decodeWAV(output);
  // const expectedData = expected.channelData;
  // const decodedAudio = decode(input);
  // const { channelData } = decodedAudio;
  // const eq = (a, b) => {
  //   return Buffer.from(a.buffer).equals(Buffer.from(b.buffer));
  // };
  // t.ok(eq(channelData[0], expectedData[0]), "should be equal");
  // t.ok(eq(channelData[1], expectedData[1]), "should be equal");
});

tape("dequant tab", async (t) => {
  const qoa_dequant_tab = [
    [1, -1, 3, -3, 5, -5, 7, -7],
    [5, -5, 18, -18, 32, -32, 49, -49],
    [16, -16, 53, -53, 95, -95, 147, -147],
    [34, -34, 113, -113, 203, -203, 315, -315],
    [63, -63, 210, -210, 378, -378, 588, -588],
    [104, -104, 345, -345, 621, -621, 966, -966],
    [158, -158, 528, -528, 950, -950, 1477, -1477],
    [228, -228, 760, -760, 1368, -1368, 2128, -2128],
    [316, -316, 1053, -1053, 1895, -1895, 2947, -2947],
    [422, -422, 1405, -1405, 2529, -2529, 3934, -3934],
    [548, -548, 1828, -1828, 3290, -3290, 5117, -5117],
    [696, -696, 2320, -2320, 4176, -4176, 6496, -6496],
    [868, -868, 2893, -2893, 5207, -5207, 8099, -8099],
    [1064, -1064, 3548, -3548, 6386, -6386, 9933, -9933],
    [1286, -1286, 4288, -4288, 7718, -7718, 12005, -12005],
    [1536, -1536, 5120, -5120, 9216, -9216, 14336, -14336],
  ];
  t.deepEqual(common.qoa_dequant_tab, qoa_dequant_tab, "qoa_dequant_tab");
  const qoa_scalefactor_tab = [
    1, 7, 21, 45, 84, 138, 211, 304, 421, 562, 731, 928, 1157, 1419, 1715, 2048,
  ];
  t.deepEqual(
    common.qoa_scalefactor_tab,
    qoa_scalefactor_tab,
    "qoa_scalefactor_tab"
  );

  const qoa_reciprocal_tab = [
    65536, 9363, 3121, 1457, 781, 475, 311, 216, 156, 117, 90, 71, 57, 47, 39,
    32,
  ];
  // reciprocal_tab[s] <- ((1<<16) + scalefactor_tab[s] - 1) / scalefactor_tab[s]
  const qoa_reciprocal_tab_computed = common.qoa_scalefactor_tab.map((s) =>
    Math.floor(((1 << 16) + s - 1) / s)
  );
  t.deepEqual(
    qoa_reciprocal_tab_computed,
    qoa_reciprocal_tab,
    "qoa_reciprocal_tab"
  );
});
