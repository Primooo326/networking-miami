import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AuthModule } from '@auth0/auth0-angular';
import { PagesModule } from './pages/pages.module';
import { PipearrayPipe } from './tools/pipearray.pipe';
import { StoreModule } from '@ngrx/store';
import { ROOT_REDUCERS } from 'src/redux/app.state';
@NgModule({
  declarations: [AppComponent, ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    //components module
    ComponentsModule,

    // pages module
    PagesModule,
    AppRoutingModule,

    // Import the module into the application, with configuration
    AuthModule.forRoot({
      domain: 'dev-ncmvuisfj75zltuq.us.auth0.com',
      clientId: 'KrUCwrUEEvRv8qkdQD2JkH3dtfxCa48M',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),

    StoreModule.forRoot(ROOT_REDUCERS),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
