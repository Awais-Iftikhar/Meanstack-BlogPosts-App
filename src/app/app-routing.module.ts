import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListsComponent } from './posts/post-lists/post-lists.component';
import { CreatePostsComponent } from './posts/create-posts/create-posts.component';
import { Authguard } from './auth/auth.guard';


const routes: Routes = [
  {path: '' , component: PostListsComponent},
  {path: 'create' , component: CreatePostsComponent , canActivate: [Authguard]},
  {path: 'edit/:postId' , component: CreatePostsComponent , canActivate: [Authguard]},
  {path: 'auth' , loadChildren: './auth/auth.module#AuthModule'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [Authguard]
})
export class AppRoutingModule { }
