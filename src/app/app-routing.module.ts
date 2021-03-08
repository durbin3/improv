import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicGeneratorComponent } from './music-generator/music-generator.component';

const routes: Routes = [
  { path: 'music-generator', component: MusicGeneratorComponent },
  // { path: 'second-component', component: SecondComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
