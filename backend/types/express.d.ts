// you should include this file in the types dir
declare namespace Express {
  export interface Request {
      user?: any; // or define the type for the user if you know the structure
  }
}