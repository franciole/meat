class Order {
    constructor(
        public adrres: string,
        public number: number,
        public optionlAdress: string,
        public paymentOption: string,
        public orderItem: OrderItem[] = []
    ) { }
}

class OrderItem {
    constructor(public quantity: number, public menuId: string) {

    }
}

export { Order, OrderItem }