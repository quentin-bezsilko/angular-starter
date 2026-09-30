export enum SampleStatus {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED'
}

export interface Sample {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  stock: number | null;
  weight: number | null;
  ratio: number | null;
  price: number;
  active: boolean;
  category: string;
  manufacturedDate: string | null;
  manufacturedTime: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  externalId: string;
  document: string;
  comments: string | null;
  status: SampleStatus;
  version: number | null;
}

export interface CreateSampleRequest {
  name: string;
  description: string | null;
  quantity: number;
  stock: number | null;
  weight: number | null;
  ratio: number | null;
  price: number;
  active: boolean;
  category: string;
  manufacturedDate: string | null;
  manufacturedTime: string | null;
  externalId: string;
  document: string;
  comments: string | null;
  status: SampleStatus;
}

export interface UpdateSampleRequest {
  name: string;
  description: string | null;
  quantity: number;
  stock: number | null;
  weight: number | null;
  ratio: number | null;
  price: number;
  active: boolean;
  category: string;
  manufacturedDate: string | null;
  manufacturedTime: string | null;
  externalId: string;
  document: string;
  comments: string | null;
  status: SampleStatus;
  version: number;
}