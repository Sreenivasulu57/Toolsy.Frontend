import { SubCategory } from './subcategory.model';

export interface ToolCategory {
  toolCategoryId: string;
  name: string;
  description: string;
  iconUrl: string;
  subCategories: SubCategory[];
}
