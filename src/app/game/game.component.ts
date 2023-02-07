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
  docData,
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
  game: Game;
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
      const docRef = doc(coll, this.gameId);
      this.item$ = docData(docRef);

      this.item$.subscribe((game: any) => {
        console.log('Game Updated', game);
        this.game.currentPlayer = game.currentPlayer;
        this.game.players = game.players;
        this.game.playedCards = game.playedCards;
        this.game.stack = game.stack;
        this.game.currentCard = game.currentCard;
        this.game.pickCardAnimation = game.pickCardAnimation;
      });
    });
  }

  newGame() {
    this.game = new Game();
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      // the function works only if pickCardAnimation= false
      this.game.pickCardAnimation = true;
      this.game.currentCard = this.game.stack.pop();
      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();
      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        //if name exists and larger than 0, push name in the array
        this.game.players.push(name);
        // const coll = collection(this.firestore, 'games');
        // const docRef = doc(coll, this.gameId);
        // updateDoc(docRef, { players: this.game.players });
        this.saveGame();
      }
    });
  }

  saveGame() {
    const coll = collection(this.firestore, 'games');
    const docRef = doc(coll, this.gameId);
    updateDoc(docRef, this.game.toJson());
  }

  // refresh() {
  //   this.cd.detectChanges();
  // }
}
