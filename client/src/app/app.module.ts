import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from 'app/app-routing.module';
import { AppComponent } from 'app/app.component';
import { HttpModule } from '@angular/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NewsComponent } from './components/news/news.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { LoginComponent } from './components/login/login.component';
import { VacanciesComponent } from './components/vacancies/vacancies.component';
import { AuthService } from './services/auth.service';
import { ProfileComponent } from './components/profile/profile.component';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { EditorComponent } from './components/text_editor/editor/editor.component';
import { NewsService } from './services/news.service';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { EditNewsComponent } from './components/news/edit-news/edit-news.component';
import { FullNewsComponent } from './components/news/full-news/full-news.component';
import { FooterComponent } from './components/footer/footer.component';
import { CreateNewsComponent } from './components/news/create-news/create-news.component';
import { DeleteNewsComponent } from './components/news/delete-news/delete-news.component';
import { VacanciesService } from './services/vacancies.service';
import { ArticlesService } from './services/articles.service';
import { CreateVacancyComponent } from './components/vacancies/create-vacancy/create-vacancy.component';
import { DeleteVacancyComponent } from './components/vacancies/delete-vacancy/delete-vacancy.component';
import { EditVacancyComponent } from './components/vacancies/edit-vacancy/edit-vacancy.component';
import { FullVacancyComponent } from './components/vacancies/full-vacancy/full-vacancy.component';
import { LostPasswordComponent } from './components/lost-password/lost-password.component';
import { AboutSiteComponent } from './components/about-site/about-site.component';
import { CreateArticleComponent } from './components/articles/create-article/create-article.component';
import { DeleteArticleComponent } from './components/articles/delete-article/delete-article.component';
import { EditArticleComponent } from './components/articles/edit-article/edit-article.component';
import { FullArticleComponent } from './components/articles/full-article/full-article.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    NewsComponent,
    RegistrationComponent,
    ArticlesComponent,
    LoginComponent,
    ProfileComponent,
    EditorComponent,
    SafeHtmlPipe,
    EditNewsComponent,
    FullNewsComponent,
    FooterComponent,
    CreateNewsComponent,
    DeleteNewsComponent,
    VacanciesComponent,
    CreateVacancyComponent,
    DeleteVacancyComponent,
    EditVacancyComponent,
    FullVacancyComponent,
    LostPasswordComponent,
    AboutSiteComponent,
    CreateArticleComponent,
    DeleteArticleComponent,
    EditArticleComponent,
    FullArticleComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    FlashMessagesModule,
  ],
  providers: [AuthService, NewsService, VacanciesService, ArticlesService, AuthGuard, NotAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
