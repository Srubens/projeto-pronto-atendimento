import { Component, OnInit } from '@angular/core';
import * as moment from 'moment'
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

    atendimento:any = []
    chamados:any = []

    atdPrioridade:any = localStorage.getItem('atendimentosPrioritarios')
    atdGeral:any = localStorage.getItem('atendimentosGerais')
    atdExames:any = localStorage.getItem('atendimentosExames')

    constructor() {}

    ngOnInit(){
      this.atendimento = this.separarAtendimentosPorTipo()
      this.chamados = this.recuperaDado()
    }

    separarAtendimentosPorTipo() {
      let db:any = localStorage.getItem('atendimentos')
      const atendimentos = JSON.parse(db) || [];
      
      // Separando os atendimentos por tipo
      const atendimentosPrioritarios = atendimentos.filter((atendimento:any) => atendimento.tipo === 'PRIORITARIA');
      const atendimentosGerais = atendimentos.filter((atendimento:any) => atendimento.tipo === 'GERAL');
      const atendimentosExames = atendimentos.filter((atendimento:any) => atendimento.tipo === 'EXAMES');
    
      // Salvando os dados separados no localStorage
      localStorage.setItem('atendimentosPrioritarios', JSON.stringify([...atendimentosPrioritarios]));
      localStorage.setItem('atendimentosGerais', JSON.stringify([...atendimentosGerais]));
      localStorage.setItem('atendimentosExames', JSON.stringify([...atendimentosExames]));
    }

    chamarAtendimento() {
      // Carregar os atendimentos do localStorage
      const atendimentosPrioritarios = JSON.parse(this.atdPrioridade) || [];
      const atendimentosGerais = JSON.parse(this.atdGeral) || [];
      const atendimentosExames = JSON.parse(this.atdExames) || [];
    
      // Função para marcar o atendimento como chamado
      function marcarComoChamado(atendimento:any) {
        atendimento['qtd-atendimento'] = 1;
        atendimento['data-atendimento'] = moment().locale('pt-br').format('DD/MM/YYYY h:mm a');
      }
    
      // Função para processar os atendimentos
      function processarAtendimentos(tipo:any, tempoEspera:any) {
        const atendimentos = tipo === 'PRIORITARIA' ? atendimentosPrioritarios : tipo === 'GERAL' ? atendimentosGerais : atendimentosExames;
    
        let dbChamados:any = localStorage.getItem('chamados');
        let chamados = JSON.parse(dbChamados) || [];
    
        if (atendimentos.length > 0) {
          const atendimento = atendimentos.shift(); // Pega o primeiro atendimento da fila
    
          // Verifica se a senha já foi chamada antes
          const senhaJaChamada = chamados.some((chamado:any) => chamado.senha === atendimento.senha);
          if (!senhaJaChamada) {
            marcarComoChamado(atendimento);
            chamados.push(atendimento);
            localStorage.setItem('chamados', JSON.stringify([...chamados]));
            console.log('chamado: ', chamados)
          } else {
            console.log(`A senha ${atendimento.senha} já foi chamada anteriormente.`);
            // Você pode adicionar alguma lógica aqui para tratar o caso de senha repetida.
          }
        }
    
        // Reagendar a próxima chamada
        setTimeout(() => {
          processarAtendimentos(tipo, tempoEspera);
        }, tempoEspera * 1000);
      }
    
      // Iniciar o processo de chamada
      processarAtendimentos('PRIORITARIA', 25); // Prioritários primeiro, espera 25 segundos
      setTimeout(() => {
        processarAtendimentos('GERAL', 35); // Gerais depois, espera 45 segundos
        setTimeout(() => {
          processarAtendimentos('EXAMES', 35); // Exames por último, espera 35 segundos
        }, 4000);
      }, 500);
    }
    
    
    

    recuperaDado():any{
      let db:any = localStorage.getItem('chamados')
      let chamados = JSON.parse(db) || []
      return chamados
    }

    
}
