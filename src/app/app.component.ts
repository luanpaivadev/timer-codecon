import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import moment from 'moment';

const HORA_INICIAL = "00";
const MINUTO_INICIAL = "00";
const SEGUNDO_INICIAL = "30";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  @ViewChild("inputHoras") inputHoras!: ElementRef<HTMLInputElement>;

  interval: any;
  camposEditaveis: boolean = false;
  tempoIniciado: boolean = false;
  contagemRegressiva: boolean = false;
  fimDoTempo: boolean = false;
  fullscreen: boolean = false;

  bkpHoras: string = HORA_INICIAL;
  bkpMinutos: string = MINUTO_INICIAL;
  bkpSegundos: string = SEGUNDO_INICIAL;
  horas: string = HORA_INICIAL;
  minutos: string = MINUTO_INICIAL;
  segundos: string = SEGUNDO_INICIAL;
  timer = moment.duration(this.converterParaSegundos(), "seconds");

  play() {

    this.tempoIniciado = true;

    this.interval = setInterval(() => {
      this.timer = moment.duration(this.converterParaSegundos(), "seconds");
      this.timer.subtract(1, "seconds");
      this.horas = this.validarTamanho(this.timer.hours().toString());
      this.minutos = this.validarTamanho(this.timer.minutes().toString());
      this.segundos = this.validarTamanho(this.timer.seconds().toString());

      if (this.timer.asSeconds() <= 10) {
        this.contagemRegressiva = true;
        const somContagemRegressiva = new Audio('/asset_sound_tick-tack.wav');
        somContagemRegressiva.load();
        somContagemRegressiva.play();
        
        if (this.timer.asSeconds() === 0) {
          this.pause();
          this.fimDoTempo = true;
          this.tocarAlarme();
          this.reload();
        }
      }


    }, 1000);
  }

  pause() {
    if (this.interval) clearInterval(this.interval);
    this.tempoIniciado = false;
  }

  edit() {
    this.pause();
    this.camposEditaveis = true;
    this.bkpHoras = this.horas;
    this.bkpMinutos = this.minutos;
    this.bkpSegundos = this.segundos;
    setTimeout(() => {
      if (this.inputHoras) {
        this.inputHoras.nativeElement.focus();
      }
    }, 500);
  }

  reset() {
    this.pause();
    this.fimDoTempo = false;
    this.horas = HORA_INICIAL;
    this.minutos = MINUTO_INICIAL;
    this.segundos = SEGUNDO_INICIAL;
  }

  cancel() {
    this.camposEditaveis = false;
    this.horas = this.bkpHoras;
    this.minutos = this.bkpMinutos;
    this.segundos = this.bkpSegundos;
  }

  approve() {
    this.camposEditaveis = false;
  }

  reload() {
    setTimeout(() => window.location.reload(), 5000);
  }

  converterParaSegundos() {
    return (Number(this.horas) * 60 * 60) + (Number(this.minutos) * 60) + Number(this.segundos);
  }

  validarTamanho(value: string) {
    return value.length < 2 ? "0" + value : value;
  }

  ajustarContagemRegressiva(value: string) {
    return Number(value) < 10 ? value.charAt(1) : value;
  }

  private tocarAlarme() {
    const audio = new Audio('/asset_sound_stop.mp3');
    audio.load();
    audio.play();
  }

  toggleFullscreen() {
    const documento: any = window.document;
    const elemento: any = document.documentElement;

    if (!this.fullscreen) {
      if (elemento.requestFullscreen) {
        elemento.requestFullscreen();
      } else if (elemento.webkitRequestFullscreen) {
        elemento.webkitRequestFullscreen();
      } else if (elemento.msRequestFullscreen) {
        elemento.msRequestFullscreen();
      }
      this.fullscreen = true;
    } else {
      if (documento.exitFullscreen) {
        documento.exitFullscreen();
      } else if (documento.webkitExitFullscreen) {
        documento.webkitExitFullscreen();
      } else if (documento.msExitFullscreen) {
        documento.msExitFullscreen();
      }
      this.fullscreen = false;
    }
  }
}
