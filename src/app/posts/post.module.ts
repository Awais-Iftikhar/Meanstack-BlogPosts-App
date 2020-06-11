import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreatePostsComponent } from './create-posts/create-posts.component';
import { PostListsComponent } from './post-lists/post-lists.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CreatePostsComponent,
    PostListsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class PostModule { }
