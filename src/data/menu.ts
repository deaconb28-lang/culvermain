import menu from './menu.json';

export type Dish = {
  /** Dish name as written by the kitchen, without the dietary tag. */
  name: string;
  /** Dietary tag(s), e.g. "V, GF". Empty string when the dish has none. */
  tag: string;
  desc: string;
  /** Optional, e.g. "$18". No prices have been supplied yet. */
  price?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  items: Dish[];
  footnote?: string;
};

export const categories = menu.categories as MenuCategory[];
export const legend = menu.legend as string[];

/** Display name: the dietary tag is appended in parentheses. */
export const dishLabel = (d: Dish): string => (d.tag ? `${d.name} (${d.tag})` : d.name);
