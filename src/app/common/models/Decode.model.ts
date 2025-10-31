export interface DecodedToken {
  sub: string;
  email: string;
  role: string[];
  exp: number;
  [key: string]: any;
}
