import { ToolAvailabilityStatus } from '../../enums/ToolAvailabilityStatus';
import { ToolCondition } from '../../enums/ToolCondition';
import { ToolImage } from './tool-image.model';
import { ToolSpecification } from './tool-specification.model';

export interface Tool {
  toolId: string;
  name: string;
  description: string;
  brand: string;
  model: string;
  serialNumber: string;
  manufactureYear: number;
  condition: ToolCondition;
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  yearlyRate: number;
  securityDeposit: number;
  availabilityStatus: ToolAvailabilityStatus;
  requiresOperator: boolean;
  operatorRequirements: string;
  safetyInstructions: string;
  toolImages: ToolImage[];
  toolSpecifications: ToolSpecification[];
}
