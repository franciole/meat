import { Router } from '@angular/router';
import { CartItem } from '../restaurant-detail/shopping-cart/cart-item.model';
import { OrderService } from './order.services';
import { Component, OnInit } from '@angular/core';
import { RadioOption } from '../shared/radio/radio-option.model';
import { Order, OrderItem } from './order.model';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'mt-order',
  templateUrl: './order.component.html'
})
export class OrderComponent implements OnInit {

  emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i

  addresPattern = /^[0-9]*$/

  orderForm: FormGroup

  delivery: number = 8

  oderId: string

  validField = this.formBuilder.control

  paymentOptions: RadioOption[] = [
    { label: 'Dinheiro', value: 'MON' },
    { label: 'Cartão de Débito', value: 'DEB' },
    { label: 'Cartão Refeição', value: 'REF' }
  ]

  constructor(private orderService: OrderService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.orderForm = new FormGroup({
      // name: this.validField('', [Validators.required, Validators.minLength(5)]),
      name: new FormControl('', {
        validators: [Validators.required, Validators.minLength(5)]
      }),
      email: this.validField('', [Validators.required, Validators.pattern(this.emailPattern)]),
      emailConfirmation: this.validField('', [Validators.required, Validators.pattern(this.emailPattern)]),
      address: this.validField('', [Validators.required, Validators.minLength(5)]),
      number: this.validField('', [Validators.required, Validators.pattern(this.addresPattern)]),
      optionalAddress: this.validField(''),
      paymentOption: this.validField('', [Validators.required])
    }, { validators: [OrderComponent.equalsTo], updateOn: 'blur' })
  }

  static equalsTo(group: AbstractControl): { [key: string]: boolean } {
    const email = group.get('email')
    const emailConfirmation = group.get('emailConfirmation')
    if (!email || !emailConfirmation) {
      return undefined
    }
    if (email.value !== emailConfirmation.value) {
      return { emailNotMatch: true }
    }
    return undefined
  }

  itemsValue(): number {
    return this.orderService.itemsValue()
  }

  cartItems(): CartItem[] {
    return this.orderService.cartItems()
  }

  increaseQty(item: CartItem) {
    this.orderService.increaseQty(item)
  }

  decreaseQty(item: CartItem) {
    this.orderService.decreaseQty(item)
  }

  remove(item: CartItem) {
    this.orderService.remove(item)
  }

  isOrderComplete(): boolean {
    return this.oderId !== undefined
  }

  checkOrder(order: Order) {
    order.orderItem = this.cartItems()
      .map((item: CartItem) => new OrderItem(item.quantity, item.menuItem.id))
    this.orderService.checkOrder(order)
      .pipe(tap((orderId: string) => {
        this.oderId = orderId
      }))
      .subscribe((orderId: string) => {
        this.router.navigate(['/order-sumary'])
        this.orderService.clear()
      })
  }
}
