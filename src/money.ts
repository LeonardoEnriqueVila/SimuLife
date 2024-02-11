export class Money {
    constructor(public amount: number) {}

    addMoney(amount: number): void {
        this.amount += amount;
    }

    subtractMoney(amount: number): boolean {
        if (this.amount >= amount) {
            this.amount -= amount;
            return true;
        } else {
            return false; // No suficiente dinero
        }
    }

    canAfford(amount: number): boolean {
        return this.amount >= amount;
    }
}

export const playerMoney = new Money(1000);
UIManager.updateText("money", playerMoney.amount.toString());
