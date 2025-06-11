// import type { StreamContent } from "@perf-mono/types";

// Temporary interface until StreamContent is added to types package
interface StreamContent {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  streamUrl: string;
  streamerName: string;
  viewerCount: number;
  isLive: boolean;
  category: string;
  tags: string[];
  startTime: string;
  endTime?: string;
}

const streamTitles = [
  "Amazing Nature Documentary",
  "Tech Review: Latest Gadgets",
  "Cooking Masterclass",
  "Fitness Training Session",
  "Music Concert Live",
  "Gaming Tournament",
  "Educational Lecture",
  "Travel Vlog Adventure",
  "Art Tutorial Workshop",
  "News and Updates",
];

const streamCategories = [
  "Documentary",
  "Technology",
  "Cooking",
  "Fitness",
  "Music",
  "Gaming",
  "Education",
  "Travel",
  "Art",
  "News",
];

const creators = [
  "CreatorOne",
  "TechGuru",
  "ChefMaster",
  "FitnessPro",
  "MusicLover",
  "GameStreamer",
  "TeacherBest",
  "TravelExplorer",
  "ArtistCreative",
  "NewsReporter",
];

const randomChoice = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const generateId = (): string => {
  return "stream-" + Math.random().toString(36).substr(2, 9);
};

export const createStream = (id?: string): StreamContent => {
  const viewerCount = Math.floor(Math.random() * 10000);

  return {
    id: id || generateId(),
    title: randomChoice(streamTitles),
    description: "Amazing content you must watch!",
    thumbnailUrl: `https://picsum.photos/1280/720?random=${Math.floor(Math.random() * 1000)}`,
    streamUrl: `https://sample-videos.com/zip/10/mp4/720/${Math.floor(Math.random() * 10)}.mp4`,
    streamerName: randomChoice(creators),
    viewerCount,
    isLive: Math.random() > 0.9,
    category: randomChoice(streamCategories),
    tags: ["popular", "trending"],
    startTime: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    endTime: Math.random() > 0.5 ? new Date().toISOString() : undefined,
  };
};

export const createStreams = (count: number = 200): StreamContent[] => {
  return Array.from({ length: count }, (_, index) =>
    createStream(`stream-${index + 1}`)
  );
};

export const mockStreams = createStreams(200);
