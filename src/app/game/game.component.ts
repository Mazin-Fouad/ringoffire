import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Observable } from 'rxjs';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';
import { ActivatedRoute, Route } from '@angular/router';

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
  // games: Array<any>;

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      let id = params['id'];

      const coll = collection(this.firestore, 'games');
      this.item$ = collectionData(coll, id);

      this.item$.subscribe((newGame) => {
        console.log('Game Updated', newGame);

        this.game.currentPlayer = newGame.currentPlayer;
        this.game.playedCards = newGame.playedCards;
        this.game.players = newGame.players;
        this.game.stack = newGame.stack;
      });
    });
  }

  newGame() {
    this.game = new Game();
    // const coll = collection(this.firestore, 'games');
    // // setDoc(doc(coll), this.game.toJson());
    // addDoc(coll, this.game.toJson());
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
}
