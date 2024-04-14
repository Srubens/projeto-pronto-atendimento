import { Component } from '@angular/core';
import * as moment from 'moment'
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.css']
})
export class Tab2Page {

  nomePaciente:any
  passwordFormat:any
  myTimer = moment().locale('pt-br').format('DD/MM/YYYY h:mm a')
  dtAtendimento:any = 0
  qtdAtendimento = 0
  btn = false

  constructor(
    private toastControl:ToastController
  ) {}

  campoPreenchido(){
    this.btn = this.nomePaciente.trim().length > 0 
  }

  dataAtendimento(prefixoSenha:any,contagem:any,nmpaciente:any,mytimer:any,dtAtendimento:any,qtdAtendimento:any) {

    let db:any = localStorage.getItem(contagem)
    let count = parseInt(db) || 0;
    count++;
  
    this.passwordFormat = `${moment().format('YYMMDD')}-${prefixoSenha}${count}`
  
    let objAtendimento = {
      'senha': this.passwordFormat,
      'data-emissao': mytimer,
      'data-atendimento': dtAtendimento,
      'qtd-atendimento': qtdAtendimento,
      'nome-paciente': nmpaciente,
      'tipo':contagem
    };
  
    // Recupera o array de atendimentos do localStorage ou cria um novo array se não existir
    let dbAtendimentos:any = localStorage.getItem('atendimentos')
    let atendimentos = JSON.parse(dbAtendimentos) || [];
  
    // Adiciona o novo objeto de atendimento ao array
    atendimentos.push(objAtendimento);
  
    // Salva o array atualizado de atendimentos no localStorage
    localStorage.setItem('atendimentos', JSON.stringify(atendimentos));
    localStorage.setItem(contagem, count.toString());
  
    console.log(objAtendimento);
    this.clickToast('Cadastrado ao atendimento com sucesso');
  
    setTimeout(() => {
      this.nomePaciente = '';
      this.passwordFormat = '';
    }, 1000);
  }

  myClickBotao1() {
    this.campoPreenchido()
    this.dataAtendimento('SP', 'PRIORITARIA', this.nomePaciente, this.myTimer, this.dtAtendimento, this.qtdAtendimento)
    this.btn = false
  }
  
  myClickBotao2() {
    this.campoPreenchido()
    this.dataAtendimento('SG', 'GERAL', this.nomePaciente, this.myTimer, this.dtAtendimento, this.qtdAtendimento)
    this.btn = false
  }
  
  myClickBotao3() {
    this.campoPreenchido()
    this.dataAtendimento('SE', 'EXAMES', this.nomePaciente, this.myTimer, this.dtAtendimento, this.qtdAtendimento)
    this.btn = false
  }
  

  async clickToast(message:any){
    const toast = await this.toastControl.create({
      message:message,
      duration:800,
      position:'middle'
    })
    await toast.present()
  }

}
