import { Component, OnInit } from '@angular/core';
import { User } from '../../models/User';
import { NotificationApp } from '../../models/NotificationApp';
import { TokenStorageService } from '../../service/token-storage.service';
import { UserService } from '../../service/user.service';
import {ImageUploadService} from '../../service/image-upload.service';
import {NotificationAppService} from '../../service/notification-app.service';
import { Router } from '@angular/router';

@Component({
selector: 'app-navigation',
templateUrl: './navigation.component.html',
styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  isLoggedIn = false;
  isDataLoaded = false;
  user: User;
  userProfileImage: File;
  searchTerm: string;
  notifications: NotificationApp[] = [];
  unreadNotifications = 0;

constructor(
    private tokenService: TokenStorageService,
    private userService: UserService,
    private imageService: ImageUploadService,
    private notificationAppService: NotificationAppService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenService.getToken();

    if(this.isLoggedIn) {
      this.userService.getCurrentUser()
        .subscribe(data => {
          this.user = data;
          this.isDataLoaded = true;


      this.notificationAppService.getAllByUser().subscribe(data => {
        this.notifications = data;
        this.unreadNotifications = this.notifications.filter(notif => !notif.isRead).length;
      });
        })
      this.imageService.getProfileImage()
        .subscribe(data => {
          this.userProfileImage = data.imageBytes;
        });
    }
  }

  logout(): void {
    this.tokenService.logOut();
    this.router.navigate(['/login']);
  }

  markAsRead(id: number): void {
    this.notificationAppService.read(id).subscribe(() => {
      this.notifications = this.notifications.map(notif => {
        if (notif.id === id) {
          notif.isRead = true;
        }
        return notif;
      });
      this.unreadNotifications = this.notifications.filter(notif => !notif.isRead).length;
    });
  }

  onSearch(event): void {
    event.preventDefault();

    if (this.searchTerm) {
      this.router.navigate(['/profile/', this.searchTerm]);
      this.searchTerm = '';
    }
  }
    formatImage(img: any): any {
      if (img == null) {
        return null;
      }
      return 'data:image/jpeg;base64,' + img;
    }
}

