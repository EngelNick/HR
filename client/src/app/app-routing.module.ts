import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { appRoutes } from "app/routes";

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(appRoutes)],
    providers: [],
    bootstrap: [],
    exports: [RouterModule]
}) 
export class AppRoutingModule {
    
}