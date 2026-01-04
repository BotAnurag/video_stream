import path from "node:path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";

type Variant = {
  name: string;
  width: number;
  height: number;
  bitrate: number;
};

// ffmpeg.service.ts
export default async function processVideoToHLS(file: string) {
  const VARIANTS = [
    { name: "1080p", width: 1920, height: 1080, bitrate: 5000 },
    { name: "720p", width: 1280, height: 720, bitrate: 3000 },
    { name: "480p", width: 854, height: 480, bitrate: 1500 },
  ];

  const Pathname = path.parse(file).name;

  const baseDir = path.join(__dirname, "../../video", Pathname);
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, { recursive: true });

  const masterPlaylist: string[] = ["#EXTM3U"];
  const variantPaths: { name: string; path: string }[] = [];

  for (const v of VARIANTS) {
    const variantDir = path.join(baseDir, v.name);
    if (!fs.existsSync(variantDir))
      fs.mkdirSync(variantDir, { recursive: true });

    await new Promise<void>((resolve, reject) => {
      ffmpeg(file)
        .outputOptions([
          "-preset veryfast",
          "-g 48",
          "-sc_threshold 0",
          "-map 0:v:0",
          "-map 0:a:0?",
          `-s:v ${v.width}x${v.height}`,
          "-c:v libx264",
          `-b:v ${v.bitrate}k`,
          "-profile:v main",
          "-crf 20",
          "-c:a aac",
          "-ar 48000",
          "-hls_time 10",
          "-hls_list_size 0",
          "-hls_flags independent_segments",
          "-start_number 0",
        ])
        .output(path.join(variantDir, "playlist.m3u8"))
        .on("end", () => {
          console.log(`Finished ${v.name}`);
          variantPaths.push({
            name: v.name,
            path: `/video/${Pathname}/${v.name}/playlist.m3u8`,
          });
          resolve();
        })
        .on("error", (err) => reject(err))
        .run();
    });

    masterPlaylist.push(
      `#EXT-X-STREAM-INF:BANDWIDTH=${v.bitrate * 1000},RESOLUTION=${v.width}x${
        v.height
      }`,
      `${v.name}/playlist.m3u8`
    );
  }

  fs.writeFileSync(
    path.join(baseDir, "playlist.m3u8"),
    masterPlaylist.join("\n")
  );

  return { variantPaths };
}
