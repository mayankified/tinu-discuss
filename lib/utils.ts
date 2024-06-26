import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";
import { BadgeCounts } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamps = (createdAt: Date): string => {
  const now: Date = new Date();

  const timeDifference: number = now.getTime() - createdAt.getTime();
  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);
  const weeks: number = Math.floor(days / 7);
  const months: number = Math.floor(days / 30);
  const years: number = Math.floor(days / 365);

  if (seconds < 60) {
    return `${seconds} sec ago`;
  } else if (minutes < 60) {
    return `${minutes} min ago`;
  } else if (hours < 24) {
    return `${hours} hour ago`;
  } else if (days < 7) {
    return `${days} day ago`;
  } else if (weeks < 4) {
    return `${weeks} week ago`;
  } else if (months < 12) {
    return `${months} month ago`;
  } else {
    return `${years} year ago`;
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return String(num);
  }
};

export function formatMonthYear(date: Date): string {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${month} ${year}`;
}
interface UrlqueryParams {
  params: string;
  value: string | null;
  key: string;
}
export function formURLquery({ params, key, value }: UrlqueryParams) {
  const currentUrl = qs.parse(params);
  currentUrl[key] = value;
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}
interface removequeryParams {
  params: string;
  key: string[];
}

export function removeKeysfromQuery({ params, key }: removequeryParams) {
  const currentUrl = qs.parse(params);
  key.forEach((item) => {
    delete currentUrl[item];
  });
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    {
      skipNull: true,
    }
  );
}

interface Badgeparams {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}

export const assignBadges = (params: Badgeparams) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((element) => {
    const { type, count } = element;
    const BadgeLevel: any = BADGE_CRITERIA[type];

    Object.keys(BadgeLevel).forEach((level: any) => {
      if (count >= BadgeLevel[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1;
      }
    });
  });

  return badgeCounts;
};
