import { Component, OnInit , EventEmitter, Output, OnDestroy} from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';
import { Form, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-create-posts',
  templateUrl: './create-posts.component.html',
  styleUrls: ['./create-posts.component.css']
})
export class CreatePostsComponent implements OnInit , OnDestroy {

postid: string;
post: Post;
mode = 'create';
isloading = false;
form: FormGroup;
imagepreview: string;
editsub: Subscription;
  constructor(private ps: PostService , private route: ActivatedRoute, private auths: AuthService) { }

  ngOnInit() {
    this.editsub = this.ps.editvalidation.subscribe((res) => {
      this.isloading = res;
    });
    this.form = new FormGroup({
      title : new FormControl(null, {validators: [Validators.required , Validators.minLength(3)]}),
      content : new FormControl(null, {validators: [Validators.required , Validators.minLength(3)]}),
      image: new FormControl(null , {validators: [Validators.required]})
    });
    this.route.paramMap.subscribe((param) => {
      if (param.has('postId')) {
        this.isloading = true;
        this.mode = 'update';
        this.postid = param.get('postId');
        this.ps.geteditedpost(this.postid)
        .subscribe(res => {
          this.isloading = false;
          this.post = {
            id: res._id,
            title: res.title,
            content: res.content,
            image: res.imagepath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.image
          });
        });
      } else {
        this.mode = 'create';
      }
    });
  }
  ngOnDestroy() {
    this.editsub.unsubscribe();
  }
  add(f) {
    if (f.invalid) {
      console.log('required');
      return;
    }
    this.isloading = true;
    if (this.mode === 'create') {
      const postcreated = {
        id: null,
        title: f.value.title,
        content: f.value.content,
        image: f.value.image
      };
      this.ps.addpost(postcreated);
    } else {
      const postcreated = {
        id: this.postid,
        title: f.value.title,
        content: f.value.content,
        image: f.value.image
      };
      this.ps.updatepost( this.postid, postcreated);
    }
    f.reset();
  }


  postimage(e) {
    const file = e.target.files[0];
    this.form.patchValue({
      image: file
    });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.imagepreview = (reader.result as string);

    };
  }
}
