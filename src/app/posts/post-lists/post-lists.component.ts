import { Component, OnInit , Input, OnDestroy} from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { Subject, Subscribable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-lists',
  templateUrl: './post-lists.component.html',
  styleUrls: ['./post-lists.component.css']
})
export class PostListsComponent implements OnInit , OnDestroy {
  posts: any[] = [];
  message: string;
  isloading = false;
  postperpage = 4;
  currentpage = 1;
  totalposts;
  validuser = false;
  authsub: Subscription;
  postsub: Subscription;
  userId: string;
  // posts = [
  //   {title: 'post 1' , content: 'my first post'},
  //   {title: 'post 2' , content: 'my 2nd post'},
  //   {title: 'post 3' , content: 'my 3rd post'}
  // ];

  constructor(private ps: PostService , private authservice: AuthService) {
   }

  ngOnInit() {

  this.userId = this.authservice.getuser();
  this.isloading = true;
  this.ps.getposts(this.postperpage, this.currentpage );
  this.postsub = this.ps.getnewposts().subscribe((postdata) => {
     this.isloading = false;
     this.posts = postdata.posts;
     this.totalposts = postdata.count;
   });
  this.ps.getmsg().subscribe(msg => {
     this.message = msg;
   });
  this.validuser = this.authservice.isAuthenticated;
  this.authsub = this.authservice.validuser.subscribe(res => {
    this.validuser = res;
  });


  }
ngOnDestroy() {
  this.authsub.unsubscribe();
  this.postsub.unsubscribe();
}
  deletepost(postid: string) {
    this.isloading = true;
    this.ps.deletepost(postid).subscribe(res => {
      this.ps.getposts(this.postperpage, this.currentpage);
    }, err => {
      this.isloading = false;
    });
  }

  paginator(e) {
    this.isloading = true;
    this.currentpage = e.pageIndex + 1 ;
    this.postperpage = e.pageSize;
    this.ps.getposts(this.postperpage, this.currentpage );
  }
}
