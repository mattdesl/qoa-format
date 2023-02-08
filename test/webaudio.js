import decode from "../decode.js";

async function load() {
  console.time("load");
  const buffer = await (
    await fetch("fixtures/sting_banjo_humorous_02.qoa")
  ).arrayBuffer();
  console.timeEnd("load");

  console.time("decode");
  const out = decode(new Uint8Array(buffer));
  console.timeEnd("decode");
  return out;
}

async function play(audio) {
  const el = document.querySelector("#play");
  el.disabled = true;

  const context = new AudioContext();

  const audioBuffer = context.createBuffer(
    audio.channels,
    audio.samples,
    audio.sampleRate
  );

  for (let i = 0; i < audio.channels; i++) {
    audioBuffer.copyToChannel(audio.channelData[i], i);
  }

  const source = context.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(context.destination);
  source.onended = () => {
    el.disabled = false;
  };
  source.start(0);
}

(async () => {
  const audio = await load();
  document.querySelector("#play").addEventListener("click", () => play(audio));
})();
