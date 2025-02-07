import { GenericItem } from "./genericItem";

export type FolderItem = GenericItem & {
	folder: {
		childCount: number
	}
};

export const FolderItemGuard = (item: GenericItem): item is FolderItem => {
  return (item as FolderItem).folder !== undefined;
};

