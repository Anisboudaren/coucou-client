/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Agent {
  model: string;
  messageLength: number;
  allowHumanAgent: boolean;
  personality: any;
  knowledge: any;
  template: string;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  settings: {
    rules: string;
    companyInformation: string;
    primaryTraits: never[];
    communicationTone: string;
    formalityLevel: number;
    primaryFunction: string;
    brandValues: string;
    model: string;
  };
}
