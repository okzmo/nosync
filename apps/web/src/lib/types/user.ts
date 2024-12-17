import type { TSpace } from "./space";

export type TUser = {
  email: string;
  first_time: boolean;
  spaces: TSpace[];
};
