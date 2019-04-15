import {Component, OnInit} from '@angular/core'
import {trigger, transition, style, animate, state} from '@angular/animations'

let suitcases = [
  {
    amount: 0.01
  },
  {
    amount: 1
  },
  {
    amount: 5
  },
  {
    amount: 10
  },
  {
    amount: 25
  },
  {
    amount: 50
  },
  {
    amount: 75
  },
  {
    amount: 100
  },
  {
    amount: 200
  },
  {
    amount: 300
  },
  {
    amount: 400
  },
  {
    amount: 500
  },
  {
    amount: 750
  },
  {
    amount: 1000
  },
  {
    amount: 5000
  },
  {
    amount: 10000
  },
  {
    amount: 25000
  },
  {
    amount: 50000
  },
  {
    amount: 75000
  },
  {
    amount: 100000
  },
  {
    amount: 200000
  },
  {
    amount: 300000
  },
  {
    amount: 400000
  },
  {
    amount: 500000
  },
  {
    amount: 750000
  },
  {
    amount: 1000000
  }
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger(
      'myAnimation',
      [
        transition(
        ':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]
      )
    ]
    )
  ],
})

export class AppComponent implements OnInit {
  suitcases: any[];
  available: any[];
  bankerOffer: number;
  banker: number;
  hasChosenCase: boolean = false;
  numberOfPicks:number = 0;
  bankerMoments: any[] = [6,11,15,18,20];
  showBankerOffer: boolean = false;
  selectedAmounts: any[] = [];
  selectionInProgress: boolean = false;
  bankersOfferArchive: any[] = [];
  offerAccepted: boolean = false;

  constructor() { }

  ngOnInit() {
    // var sum = 0;
    this.suitcases = suitcases;
    for (var i = 0; i < this.suitcases.length; i++) {
      this.suitcases[i].random = this.randomNumberGenerator();
      this.suitcases[i].adjustedValue = this.suitcases[i].amount / 26;
      this.suitcases[i].adjustedValue = this.suitcases[i].adjustedValue.toFixed(2);
      // sum = sum + this.suitcases[i].amount
    }
    // console.log(sum)
    this.suitcases = this.suitcases.sort(function(a, b) {
      return a.random - b.random;
    });
    this.available = this.suitcases;
    for (var n = 0; n < this.available.length; n++) {
      this.available[n].number = n + 1;
      this.available[n].shown = this.available[n].number;
    }
    console.log('SORTED: ', this.suitcases);
  }

  chooseMyCase(index) {
    if (this.hasChosenCase && !this.available[index].isMyCase && !this.selectionInProgress) {
      this.selectionInProgress = true;
      this.numberOfPicks++;
      this.selectSuitcase(index);
    } else if (!this.hasChosenCase && !this.selectionInProgress) {
      this.available[index].isMyCase = true;
      this.hasChosenCase = true;
    } else {
      return;
    }
  }

  selectSuitcase(index) {
    var self = this;
    self.banker = 0;
    this.available[index].shown = this.available[index].amount;
    this.selectedAmounts.push(this.available[index].amount);
    this.removeCase.call(this, index).
        then(function() {
          // re-calculate value
          self.calculateOffer(self.available.length, self);
        });
  }

  playAgain() {
    location.reload();
  }

  acceptOffer() {
    this.offerAccepted = true;
  }

  keepPlaying() {
    this.offerAccepted = false;
  }

  removeCase(index) {
    var self = this;
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        self.available.splice(index, 1);
        resolve();
      }, 1000);
    });
  }

  randomNumberGenerator() {
    return Math.random().toFixed(5);
  }

  calculateOffer(total, self) {
    var totalValue = 0;
    var highestValue = 0;
    for (var p = 0; p < total; p++) {
      totalValue = totalValue + self.available[p].amount;
      if (highestValue < self.available[p].amount) {
        highestValue = self.available[p].amount;
      }
      self.available[p].adjustedValue = self.available[p].amount / total;
      self.available[p].adjustedValue = self.available[p].adjustedValue.toFixed(2);
    }
    var expectedValue = totalValue / total;
    self.bankerOffer = 12275.30 + (.748 * expectedValue) + (-2714.74 * total) + ( -.040 * highestValue) + (.0000006986 * Math.pow(expectedValue, 2)) + ( 32.623 * Math.pow(total, 2));
    this.showBankerCheck();
    this.selectionInProgress = false;
  }

  showBankerCheck() {
    var self = this;
    if (self.numberOfPicks > 20 || self.bankerMoments.indexOf(self.numberOfPicks) > -1) {
      self.showBankerOffer = true;
      self.bankersOfferArchive.unshift(self.bankerOffer);
    } else {
      self.showBankerOffer = false;
    }
  }
}