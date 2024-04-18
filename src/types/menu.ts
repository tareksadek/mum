
import { ImageType } from "./restaurant";

export type DietaryRestrictionType = {
  id: string;
  name: string;
};

export type DishType = {
  id: string;
  name: string;
};

export type CustomTag = {
  id: string;
  name: string;
};

export type MenuAttribute = {
  id: string;
  name: string;
};

export type MenuItemType = {
  id: string; 
  sortOrder: number;
  name: string;
  sectionId?: string;
  description?: string;
  oldPrice?: string;
  newPrice?: string;
  dietaryRestrictions?: string[];
  types?: string[];
  tags?: CustomTag[];
  ingredients?: string[];
  spiciness: string;
  temperature: string;
  size?: string; 
  visible?: boolean;
  image?: ImageType | null;
};

export type MenuSectionType = {
  id: string; 
  sortOrder: number;
  name: string | null;
  description?: string | null;
  items?: MenuItemType[];
  visible?: boolean;
  image?: ImageType | null;
};

export type MenuType = {
  id?: string; 
  name?: string;
  description?: string;
  sections?: MenuSectionType[];
  isActive?: boolean;
  currency?: string;
};

export type MenuFilterType = {
  price?: string;
  dietaryRestrictions?: string[];
  types?: string[];
  spiciness: string;
  temperature: string;
  size?: string; 
};