export type GenericItem = {
  "@odata.context": string;
  createdBy: {
    user: {
        email: string;
        id: string;
        displayName: string;
    }
  },
  createdDateTime: string;
  eTag: string;
  id: string;
  lastModifiedBy: {
      user: {
          email: string;
          id: string;
          displayName: string;
      }
  },
  lastModifiedDateTime: string;
  name: string;
  parentReference: {
      driveType: string;
      driveId: string;
      id: string;
      name: string;
      path: string;
      siteId: string;
  },
  webUrl: string;
  cTag: string;
  fileSystemInfo: {
    createdDateTime: string;
    lastModifiedDateTime: string;
  },
  shared: {
    scope: string;
  },
  size: number;
};

