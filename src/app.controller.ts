import { Body, Controller, Get, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Data } from './data.dto';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }
  #orders = []
  @Get()
  @Render('index')
  getHello() {
    return {
      message: this.appService.getHello()
    };
  }

  @Get("webshop")
  @Render("webshop")
  webshopform() {
    return {
      errors: [],
      order: {}
    }
  }

  @Post("webshop")
  webshop(@Body() webshop: Data, @Res() response: Response) {
    const errors: string[] = []
    if (!webshop.item || !webshop.orszag || !webshop.iranyitoszam || !webshop.varos || !webshop.utca || !webshop.hazszam || !webshop.szorszag || !webshop.szvaros || !webshop.szutca || !webshop.szhazszam || !webshop.sziranyitoszam || !webshop.cardNumber || !webshop.cvc || !webshop.expiredate || !webshop.name) {
      errors.push("Nem lehet üres mező")
    }
    let neworder = {
      item: webshop.item,
      name: webshop.name,
      orszag: webshop.orszag,
      iranyitoszam: webshop.iranyitoszam,
      varos: webshop.varos,
      utca: webshop.utca,
      hazszam: webshop.hazszam,
      szorszag: webshop.szorszag,
      sziranyitoszam: webshop.sziranyitoszam,
      szvaros: webshop.szvaros,
      szutca: webshop.szutca,
      szhazszam: webshop.szhazszam,
      kupon: webshop.kupon,
      cardNumber: webshop.cardNumber,
      expiredate: webshop.expiredate,
      cvc: webshop.cvc,
    }
    try {
      if (Date.parse(neworder.expiredate)<Date.now()) {
        errors.push("Ez a kártya már lejárt!")
      }
    } catch (error) {
      errors.push("Nem jó dátum formátum.")
    }
    
    if (errors.length > 0) {
      return {
        errors,
        order: neworder
      }
    } else {
      console.log(neworder)
      this.#orders.push(neworder)
      response.redirect(303, '/success')
    }
  }
  @Get('success')
  @Render('success')
  newaccountsuccess() {
    return {
      accounts: this.#orders.length
    }
  }

}
