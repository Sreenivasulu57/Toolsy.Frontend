import { Tool } from './tool.model';

export interface SubCategory {
  subToolCategoryId: string;
  name: string;
  description: string;
  iconUrl: string;
  isActive: boolean;
  parentCategoryId: string;
  tools: Tool[];
}
