import { Request } from 'express';

// リクエストボディに形付けてくれるやつ
export interface TypedRequestBody<T> extends Request {
  body: T;
}
