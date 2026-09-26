import { createStore, daysAgo, rng } from "./store";
import type { Customer } from "./types";

const FIRST = [
  "Rafiq", "Nusrat", "Tanvir", "Sumaiya", "Imran", "Farzana", "Sabbir", "Mehjabin",
  "Arif", "Tasnim", "Rasel", "Jannatul", "Shakib", "Maliha", "Hasib", "Nabila",
  "Omar", "Sadia", "Rakib", "Ishrat", "Fahim", "Lamia", "Zahid", "Rumana",
];

const LAST = [
  "Hossain", "Akter", "Rahman", "Islam", "Chowdhury", "Karim", "Siddique",
  "Bhuiyan", "Mahmud", "Sultana", "Alam", "Haque",
];

const CITIES = [
  "Dhaka", "Chattogram", "Sylhet", "Khulna", "Rajshahi", "Narayanganj",
  "Cumilla", "Gazipur", "Bogura", "Mymensingh",
];

const COUNT = 46;

const seed = (): Customer[] => {
  const random = rng(731_004);

  return Array.from({ length: COUNT }, (_, index) => {
    const first = FIRST[Math.floor(random() * FIRST.length)];
    const last = LAST[Math.floor(random() * LAST.length)];
    const city = CITIES[Math.floor(random() * CITIES.length)];

    return {
      id: `CU-${2000 + index}`,
      name: `${first} ${last}`,
      email: `${first}.${last}${index}`.toLowerCase() + "@example.com",
      phone: `01${3 + Math.floor(random() * 7)}${String(Math.floor(random() * 1e8)).padStart(8, "0")}`,
      city,
      joinedAt: daysAgo(Math.round(random() * 400) + 1),
      blocked: random() < 0.04,
    };
  });
};

export const customers = createStore(seed);

export const useCustomers = (): Customer[] => customers.use();
