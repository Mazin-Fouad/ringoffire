export class Game {
  public players: string[] = [];
  public stack: string[] = [];
  public playedCards: string[] = [];
  public currentPlayer: number = 0;
  public currentCard: string = '';
  public pickCardAnimation = false;

  constructor() {
    for (let i = 1; i < 14; i++) {
      this.stack.push(`ace_${i}`);
      this.stack.push(`hearts_${i}`);
      this.stack.push(`clubs_${i}`);
      this.stack.push(`diamonds_${i}`);
    }
    shuffle(this.stack);
  }

  public toJson() {
    return {
      players: this.players,
      stack: this.stack,
      playedCards: this.playedCards,
      currentPlayer: this.currentPlayer,
      currentCard: this.currentCard,
      pickCardAnimation: this.pickCardAnimation,
    };
  }
}

/**
 * to shuffle array elements
 * @param array
 * @returns shuffeld array
 */
function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
