import { Component, OnInit } from '@angular/core';
import { Tarefa } from '../../models/tarefa';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-tarefa-lista',
  templateUrl: './tarefa-lista.component.html',
  styleUrls: ['./tarefa-lista.component.css']
})
export class TarefaListaComponent implements OnInit {
  tarefas: Tarefa[] | undefined;
  msgErro: string = '';


  constructor(private tarefasServices: TarefasService) { }

  ngOnInit() {
    this.obterTarefas();
  }

  obterTarefas(){
    debugger
    this.tarefasServices.obterTarefas().subscribe(
      tarefas => {
        this.tarefas = tarefas;
      },
      error => this.msgErro = <any>error

    );
  }

}
