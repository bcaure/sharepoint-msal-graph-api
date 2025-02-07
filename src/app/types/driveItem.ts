import { GenericItem } from "./genericItem";

export type DriveItem = GenericItem & {
  driveType: string;
}
export const DriveItemGuard = (item: GenericItem): item is DriveItem => {
  return (item as DriveItem).driveType !== undefined;
};
