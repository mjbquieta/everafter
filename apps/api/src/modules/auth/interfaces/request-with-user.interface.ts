import type { Request } from 'express';
import type { Wedding, WeddingMember } from '@everafter/database';

export interface RequestUser {
  userId: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: RequestUser;
  wedding?: Wedding;
  weddingMember?: WeddingMember;
}
