import {
    ArticlesComponent,
    CreateArticleComponent,
    DeleteArticleComponent,
    EditArticleComponent,
    FullArticleComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    EditorComponent,
    NewsComponent,
    EditNewsComponent,
    FullNewsComponent,
    CreateNewsComponent,
    DeleteNewsComponent,
    VacanciesComponent,
    CreateVacancyComponent,
    DeleteVacancyComponent,
    EditVacancyComponent,
    FullVacancyComponent,
    LostPasswordComponent,
    AboutSiteComponent
} from 'app/components/index';

import { Routes } from '@angular/router';
import { AuthGuard } from 'app/guards/auth.guard';
import { NotAuthGuard } from 'app/guards/notAuth.guard';


export const appRoutes: Routes = [
    { path: '', redirectTo: 'news', pathMatch: 'full' },
    { path: 'news', component: NewsComponent },
    { path: 'news/:id', component: NewsComponent },
    { path: 'full-news/:id', component: FullNewsComponent },
    { path: 'edit-news/:id', component: EditNewsComponent, canActivate: [AuthGuard] },
    { path: 'create-news', component: CreateNewsComponent, canActivate: [AuthGuard] },
    { path: 'delete-news/:id', component: DeleteNewsComponent, canActivate: [AuthGuard] },
    { path: 'vacancies', component: VacanciesComponent },
    { path: 'vacancies/:id', component: VacanciesComponent },
    { path: 'full-vacancy/:id', component: FullVacancyComponent },
    { path: 'edit-vacancy/:id', component: EditVacancyComponent, canActivate: [AuthGuard] },
    { path: 'create-vacancy', component: CreateVacancyComponent, canActivate: [AuthGuard] },
    { path: 'delete-vacancy/:id', component: DeleteVacancyComponent, canActivate: [AuthGuard] },
    { path: 'articles', component: ArticlesComponent },
    { path: 'articles/:id', component: ArticlesComponent },
    { path: 'full-article/:id', component: FullArticleComponent},
    { path: 'edit-article/:id', component: EditArticleComponent, canActivate: [AuthGuard] },
    { path: 'create-article', component: CreateArticleComponent, canActivate: [AuthGuard] },
    { path: 'delete-article/:id', component: DeleteArticleComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
    { path: 'registration', component: RegistrationComponent, canActivate: [NotAuthGuard] },
    { path: 'lostPassword', component: LostPasswordComponent },
    { path: 'aboutsite', component: AboutSiteComponent },
    { path: '**', redirectTo: 'news', pathMatch: 'full' }
];
