import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss'],
})
export class EditPlayerComponent {
  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {}
  allProfilePictures = [
    'user.png',
    'male-user.png',
    'woman-user.png',
    'boy.png',
    'girl.png',
    'bee.png',
    'cat.png',
    'dog.png',
    'fox.png',
    'lion.png',
    'frog.png',
    'owl.png',
    'chick.png',
    'bear.png',
  ];

  onNoClick() {
    this.dialogRef.close();
  }
}
