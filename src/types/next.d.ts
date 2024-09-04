import { IncomingMessage } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

// Extend IncomingMessage to include `files` property
declare module 'http' {
  interface IncomingMessage {
    files?: any; // Or use more specific types if available
  }
}

// Extend NextApiResponse to include `status` method
declare module 'next' {
  interface NextApiResponse {
    end: any;
    status(code: number): this;
  }
}
import { NextApiRequest, NextApiResponse } from 'next';

declare module 'next' {
  interface NextApiResponse {
    json: (body: any) => this;
    status: (code: number) => this;
  }
}