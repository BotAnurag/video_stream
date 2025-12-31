import { videoQueue } from "../queue/video.queue";
export class VideoService {
  async enqueueVideo(filePath: string, videoId: string) {
    await videoQueue.add("hls-conversion", {
      filePath,
      videoId,
    });
  }
}
