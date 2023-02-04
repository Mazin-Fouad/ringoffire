import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params);
      const id = params['id'];

      const coll = collection(this.firestore, 'games');
      this.item$ = collectionData(coll, id);

      this.item$.subscribe((game: any) => {
        console.log('Game Updated', game);
        this.game.currentPlayer = game.currentPlayer;
        this.game.playedCards = game.playedCards;
        this.game.players = game.players;
        this.game.stack = game.stack;
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

  refresh() {
    this.cd.detectChanges();
  }
}
