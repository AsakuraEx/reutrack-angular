import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agradecimiento',
  imports: [],
  templateUrl: './agradecimiento.component.html',
  styleUrl: './agradecimiento.component.css'
})
export class AgradecimientoComponent implements OnInit{

  constructor(
    private router: Router
  ){}

  ngOnInit(): void {
    setTimeout(()=>{
        this.router.navigate(['/login'])
    },5000)
  }

}
