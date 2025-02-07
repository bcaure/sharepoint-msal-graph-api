export type TableItem = {
  name: string;
  id: string;
  parentId?: string;
  createdBy: string;
  createdDateTime: string;
  lastModifiedBy: string;
  lastModifiedDateTime: string;
  size: number;
  type: TableItemType;
};

export type TableItemType = 'folder' | 'parent' | 'file' | 'drive';
