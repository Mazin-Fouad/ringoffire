import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { update } from '@angular/fire/database';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  game: Game;
  currentCard: string = '';
  item$: Observable<any>;
  gameId: any;

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.newGame();

    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      console.log('The ID is:', this.gameId);

      const coll = collection(this.firestore, 'games');
      this.item$ = collectionData(coll, this.gameId);

      this.item$.subscribe((game: any) => {
        console.log('Game Updated', game);
        this.game.currentPlayer = game.currentPlayer;
        this.game.players = game.players;
        this.game.playedCards = game.playedCards;
        this.game.stack = game.stack;
        this.refresh();
      });
    });
  }

  newGame() {
    this.game = new Game();
    this.refresh();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      // the function works only if pickCardAnimation= false
      this.pickCardAnimation = true;
      this.currentCard = this.game.stack.pop();
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
        this.refresh();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        //if name exists and larger than 0, push name in the array
        this.game.players.push(name);
      }
    });
  }

  refresh() {
    this.cd.detectChanges();
  }
}
