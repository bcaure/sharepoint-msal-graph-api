import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericItemList } from './types/genericItemList';
import { Observable, map, tap, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SiteItem } from './types/siteItem';
import { createFilesTable } from './mat-table-utils';
import { GenericItem } from './types/genericItem';
import { TableItem, TableItemType } from './types/tableItem';

@Injectable({
  providedIn: 'root'
})
export class SharepointService {
  private sharepointBaseSiteUrl: string | undefined;
  private currentDriveId: string | undefined;

  constructor(private readonly http: HttpClient) { }

  getDrivesFromSite(): Observable<GenericItemList> {
    return this.http.get<SiteItem>(`${environment.graphApiBaseUrl}/${environment.graphApiSitePath}/${environment.sharepointDomain}:/sites/${environment.sharepointSiteName}`).pipe(
      map((response) => `${environment.graphApiBaseUrl}/${environment.graphApiSitePath}/${response.id}`),
      tap((baseSiteUrl) => this.sharepointBaseSiteUrl = baseSiteUrl),
      switchMap(() => this.http.get<GenericItemList>(`${this.sharepointBaseSiteUrl}/drives`))
    );
  }

  listDriveItems(driveId: string): Observable<TableItem[]> { 
    this.currentDriveId = driveId;
    return this.http.get<GenericItem>(`${this.sharepointBaseSiteUrl}/drives/${driveId}/root`).pipe(
      switchMap((rootItem) => this.listGenericItems(rootItem.id, undefined))
    );
  }

  listFolderItems(folderId: string, parentId: string): Observable<TableItem[]> {
    return this.listGenericItems(folderId, parentId);
  }

  listParentFolderItems(folderId: string): Observable<TableItem[]> {
    const url = `${this.sharepointBaseSiteUrl}/drives/${this.currentDriveId}/items`;
    return this.http.get<GenericItem>(`${url}/${folderId}`).pipe(
      switchMap((folderItem) => this.listGenericItems(folderItem.id, folderItem.parentReference?.id))
    );
  }

  /** Common method used by the list methods above */
  private listGenericItems(theFolderOrDriveId: string, theParentId: string | undefined): Observable<TableItem[]> {
    const url = `${this.sharepointBaseSiteUrl}/drives/${this.currentDriveId}/items/${theFolderOrDriveId}/children`;
    return this.http.get<GenericItemList>(url).pipe(
      map((itemList) => {
        const children = createFilesTable(itemList.value);
        if (theParentId) {
          const parent = {
            name: '..',
            id: theParentId,
            createdBy: '',
            createdDateTime: '',
            lastModifiedBy: '',
            lastModifiedDateTime: '',
            size: 0,
            type: 'parent' as TableItemType
          };
          children.unshift(parent);
        }
        return children;
      })
    );
  };

  downloadFile(downloadUrl: string): Observable<Blob> {
    return this.http.get(downloadUrl, { responseType: 'blob' });
  }
}
