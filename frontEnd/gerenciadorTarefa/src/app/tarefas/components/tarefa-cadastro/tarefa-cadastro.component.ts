import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Tarefa } from '../../models/tarefa';
import { TarefasService } from '../../services/tarefas.service';

@Component({
  selector: 'app-tarefa-cadastro',
  templateUrl: './tarefa-cadastro.component.html',
  styleUrls: ['./tarefa-cadastro.component.css']
})
export class TarefaCadastroComponent implements OnInit, OnDestroy {
  errorMessage: string = '';
  pageTitle : string = 'Cadastro de Tarefa';
  formMode : string = '';
  tarefa!: Tarefa;
  tarefaForm!: FormGroup;
  validationManager: { [Key: string]: {[Key: string]: string } };
  private subscription!: Subscription;


  constructor( private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private tarefasServices : TarefasService
    ) { 

      this.validationManager = {
        nome:{
          required: 'Nome é obrigatório.',
          minLength: 'Nome deve ter no minimo 3 caracteres.',
          maxLength: 'Nome deve execeder 50 caracteres.',
        },
        detalhes:{
          minLength: 'Nome deve ter no minimo 3 caracteres.',
          maxLength: 'Nome deve execeder 100 caracteres.',
        }
      };
  }

  ngOnInit(): void {
    this.formMode = 'new';
    this.tarefaForm = this.fb.group({
      nome:['',[Validators.required, Validators.minLength(3),Validators.maxLength(50)]],
      detalhes:['',[ Validators.minLength(3),Validators.maxLength(1000)]],
    });

    this.subscription = this.route.paramMap.subscribe(
      params => {
        const id = params.get('id');

        if (id == null || id == ''){
          const tarefa: Tarefa = {id: "", nome: "", detalhes: ""};
          this.exibirtarefa(tarefa);
        }
        else{
          this.obterTarefa(id);
        }
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


exibirtarefa(tarefa: Tarefa): void {

    if (this.tarefaForm ) {
      this.tarefaForm.reset();
    }

    this.tarefa = tarefa;

    if (this.tarefa.id == '') {
      this.pageTitle = 'Adicionar Tarefa';
    }else{
      this.pageTitle = `Editar Tarefa: ${this.tarefa.nome}`;
    }

    this.tarefaForm.patchValue({
      nome: this.tarefa.nome,
      detalhes: this.tarefa.detalhes
    });
}

obterTarefa(id: string): void {
  this.tarefasServices.obterTarefa(id)
    .subscribe(
      (tarefa: Tarefa) => this.exibirtarefa(tarefa),
      (error : any) => this.errorMessage = <any>error
    )
}

excluirTarefa(): void { 
  if(this.tarefa.id == '') {
    this.onSaveComplete();
  }else{  
    if(confirm( `Tem certeza que deseja excluir a tarefa ${this.tarefa.nome}?`)){
      this.tarefasServices.excluirTarefa(this.tarefa.id as string)
        .subscribe(
          () => this.onSaveComplete(),
          (error: any) => this.errorMessage = <any>error
        );
    }
  }
}

salvar(): void {
  if(this.tarefaForm.valid) {
    if(this.tarefaForm.dirty) {

        const t = { ...this.tarefa, ...this.tarefaForm.value };

        if(t.id === ''){
          this.tarefasServices.criarTarefa(t)
            .subscribe(
              () => this.onSaveComplete(),
              (error: any) => this.errorMessage = <any>error
              );
        }else{
          this.tarefasServices.atualizarTarefa(t)
            .subscribe(
              () => this.onSaveComplete(),
              (error : any) => this.errorMessage = <any>error
          );
        }
    }else{
      this.onSaveComplete();
    }
  } else {
    this.errorMessage = 'Por favor corriga os erros de validação.';
  }
}


onSaveComplete(): void {
  this.tarefaForm.reset();
  this.router.navigate(['/tarefas']);
}


}
