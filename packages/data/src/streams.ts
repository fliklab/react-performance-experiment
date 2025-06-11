// import type { StreamContent } from "@perf-mono/types";

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
  const duration = Math.floor(Math.random() * 7200) + 300; // 5분-2시간
  const views = Math.floor(Math.random() * 1000000);

  return {
    id: id || generateId(),
    title: randomChoice(streamTitles),
    description: "Amazing content you must watch!",
    thumbnail: `https://picsum.photos/1280/720?random=${Math.floor(Math.random() * 1000)}`,
    videoUrl: `https://sample-videos.com/zip/10/mp4/720/${Math.floor(Math.random() * 10)}.mp4`,
    duration,
    views,
    likes: Math.floor(views * Math.random() * 0.1),
    category: randomChoice(streamCategories),
    creator: randomChoice(creators),
    createdAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ).toISOString(),
    isLive: Math.random() > 0.9,
  };
};

export const createStreams = (count: number = 200): StreamContent[] => {
  return Array.from({ length: count }, (_, index) =>
    createStream(`stream-${index + 1}`)
  );
};

export const mockStreams = createStreams(200);
