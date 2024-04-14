import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  atendimentos:any = []

  constructor() {}

  ngOnInit(){
      this.atendimentos = this.recuperaAtendimentos()
      console.log(this.atendimentos)
  }

  recuperaAtendimentos():any{
    let db:any = localStorage.getItem('atendimentos')
    let atendimentos = JSON.parse(db) || []
    return atendimentos
  }

}
