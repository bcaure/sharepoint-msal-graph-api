import { Component, Inject, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { InteractionStatus, InteractionType } from '@azure/msal-browser';

import { createFilesTable } from '../mat-table-utils';
import { environment } from 'src/environments/environment';
import { SharepointService } from '../sharepoint.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loginDisplay = false;
  dataSource: any = [];
  displayedColumns: string[] = ['name', 'lastModifiedDateTime', 'lastModifiedBy', 'createdDateTime', 'createdBy', 'size'];

  private readonly _destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG)
    private readonly msalGuardConfig: MsalGuardConfiguration,
    private readonly authService: MsalService,
    private readonly msalBroadcastService: MsalBroadcastService,
    private readonly sharepointService: SharepointService
  ) {}

  ngOnInit(): void {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None && !!this.authService.instance.getActiveAccount()),
        switchMap(() => this.sharepointService.getDrivesFromSite())
      )
      .subscribe((response) => {
        this.setLoginDisplay();
        this.dataSource = createFilesTable(response.value);
      });  
  }

  setLoginDisplay() {
    this.loginDisplay = this.authService.instance.getAllAccounts().length > 0;
  }

  signUp() {
    if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
      this.authService.loginPopup({
        scopes: [
          `${environment.graphApiBaseUrl}/.default`
        ],
        resourceRequestUri: `https://${environment.sharepointDomain}`,
        prompt: 'create',
      }).subscribe((response) => {
        this.authService.instance.setActiveAccount(response.account);
      });
        
    } else {
      this.authService.loginRedirect({
        scopes: [
          `${environment.graphApiBaseUrl}/.default`
        ],
        resourceRequestUri: `https://${environment.sharepointDomain}`,
        prompt: 'create',
      });
    }

  }

  // unsubscribe to events when component is destroyed
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  listDriveItems(driveId: string) { 
    this.sharepointService.listDriveItems(driveId).subscribe((children) => {
      this.dataSource = children;
    });
  }

  listFolderItems(folderId: string, parentId: string) {
    this.sharepointService.listFolderItems(folderId, parentId).subscribe((children) => {
      this.dataSource = children;
    });
  }

  listParentFolderItems(folderId: string) {
    this.sharepointService.listParentFolderItems(folderId).subscribe((children) => {
      this.dataSource = children;
    });
  }

  copyToCloud(downloadUrl: string) {
    this.sharepointService.downloadFile(downloadUrl);
  }
}

