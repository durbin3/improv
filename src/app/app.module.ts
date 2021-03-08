import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TitlebarComponent } from './titlebar/titlebar.component';
import { MusicGeneratorComponent } from './music-generator/music-generator.component';
import { StaveComponent } from './stave/stave.component';

@NgModule({
  declarations: [
    AppComponent,
    TitlebarComponent,
    MusicGeneratorComponent,
    StaveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
