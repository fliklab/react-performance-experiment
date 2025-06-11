import type { User, UserPreferences } from "@perf-mono/types";

const firstNames = [
  "John",
  "Jane",
  "Mike",
  "Sarah",
  "David",
  "Emily",
  "Chris",
  "Lisa",
  "Tom",
  "Anna",
];
const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
];
const domains = [
  "gmail.com",
  "yahoo.com",
  "hotmail.com",
  "outlook.com",
  "company.com",
];

const randomChoice = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

const generateId = (): string => {
  return "user-" + Math.random().toString(36).substr(2, 9);
};

export const createUser = (id?: string): User => {
  const firstName = randomChoice(firstNames);
  const lastName = randomChoice(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomChoice(domains)}`;

  const preferences: UserPreferences = {
    theme: randomChoice(["light", "dark", "system"] as const),
    language: randomChoice(["en", "ko", "ja", "es"]),
    currency: randomChoice(["USD", "EUR", "KRW", "JPY"]),
    notifications: {
      email: Math.random() > 0.3,
      push: Math.random() > 0.5,
      sms: Math.random() > 0.7,
    },
  };

  return {
    id: id || generateId(),
    name: `${firstName} ${lastName}`,
    email,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
    role: randomChoice(["user", "admin", "moderator"] as const),
    joinedAt: new Date(
      Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000
    ).toISOString(),
    preferences,
  };
};

export const createUsers = (count: number = 100): User[] => {
  return Array.from({ length: count }, (_, index) =>
    createUser(`user-${index + 1}`)
  );
};

export const mockUsers = createUsers(100);
