import { FileItemGuard } from "./types/fileItem";
import { FolderItemGuard } from "./types/folderItem";
import { GenericItem } from "./types/genericItem";
import { TableItem } from "./types/tableItem";

export const createFilesTable = (files: Array<GenericItem>): TableItem[] => {
  return files.map((item) => {
    if (FileItemGuard(item)) {
      return {
        id: item.id,
        name: item.name,
        url: item['@microsoft.graph.downloadUrl'],
        createdBy: item.createdBy.user.displayName,
        createdDateTime: item.createdDateTime,
        lastModifiedBy: item.lastModifiedBy.user.displayName,
        lastModifiedDateTime: item.lastModifiedDateTime,
        size: item.size,
        type: 'file'
      };
    } else if (FolderItemGuard(item)) {
      return {
        name: item.name,
        id: item.id,
        parentId: item.parentReference?.id,
        createdBy: item.createdBy.user.displayName,
        createdDateTime: item.createdDateTime,
        lastModifiedBy: item.lastModifiedBy?.user.displayName,
        lastModifiedDateTime: item.lastModifiedDateTime,
        size: item.size,
        type: 'folder'
      };
    } else {
      // Drive item
      return {
        name: item.name,
        id: item.id,
        createdBy: item.createdBy.user.displayName,
        createdDateTime: item.createdDateTime,
        lastModifiedBy: item.lastModifiedBy?.user.displayName,
        lastModifiedDateTime: item.lastModifiedDateTime,
        size: item.size,
        type: 'drive'
      };
    }
  });
};
