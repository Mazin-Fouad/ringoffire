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
import { ActivatedRoute, Router } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  game: Game;
  item$: Observable<any>;
  gameId: any;
  gameOver: Boolean = false;

  constructor(
    private firestore: Firestore,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public cd: ChangeDetectorRef,
    private router: Router
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
        this.game.player_images = game.player_images;
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
    if (this.game.stack.length === 0) {
      this.resetGame();
    } else if (!this.game.pickCardAnimation) {
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

  resetGame() {
    this.gameOver = true;
    setTimeout(() => {
      this.gameOver = false;
      this.router.navigateByUrl('/');
    }, 4000);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        //if name exists and larger than 0, push name in the array
        this.game.players.push(name);
        this.game.player_images.push('user.png');
        this.saveGame();
      }
    });
  }

  saveGame() {
    const coll = collection(this.firestore, 'games');
    const docRef = doc(coll, this.gameId);
    updateDoc(docRef, this.game.toJson());
  }

  editPlayer(playerId: number) {
    console.log('Edit Player', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change === 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        } else {
          console.log('Recieved Change', change);
          this.game.player_images[playerId] = change;
        }
        this.saveGame();
      }
    });
  }
}
