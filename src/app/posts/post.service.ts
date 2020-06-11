import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';


const url = `${environment.apiurl}/posts`;


@Injectable({
  providedIn: 'root'
})
export class PostService {
posts: Post[] = [];
message: string;
editvalidation = new Subject<boolean>();
newpost = new Subject<{posts: Post[] , count: number}>();
msg = new Subject<string>();

  constructor(private http: HttpClient , private router: Router , private auths: AuthService) {

  }

  // getposts(): Observable<Post[]> {
  //   return this.http.get<Post[]>(this.url);
    // return [...this.posts];
  // }

  getposts(postperpage: number, currentpage: number) {
    const queryparams  = `?pagesize=${postperpage}&page=${currentpage}`;
    return this.http.get<{message: string, body: any, postcount: number}>(`${url}/${queryparams}`)
    .pipe(map(postdata => {
      this.message = postdata.message;
      return {posts : postdata.body.map(data => {
        return {
          id: data._id,
          title: data.title,
          content: data.content,
          image: data.imagepath,
          userId: data.userid
        };
      }), count: postdata.postcount};
    }))
    .subscribe((res) => {
      this.posts = res.posts;
      this.newpost.next({posts: [...this.posts] , count: res.count});
      this.msg.next(this.message);
    });
  }
  getnewposts() {
    return this.newpost.asObservable();
  }
  getmsg() {
    return this.msg.asObservable();
  }
  addpost(post) {
    const formdata = new FormData();
    formdata.append('title', post.title);
    formdata.append('content', post.content);
    formdata.append('image', post.image);
    return this.http.post<any>( url, formdata)
    .subscribe(res => {
      // console.log(res);
      // post.id = res._id;
      // post.image = res.imagepath;
      // this.posts.push(post);
      // this.newpost.next({posts: [...this.posts], count: null});
      // console.log(this.posts);
      this.router.navigate(['/']);

    }, err => {
      this.editvalidation.next(false);
      this.router.navigate(['/']);
    });

  }

  geteditedpost(postid: string) {
    // console.log('edited', postid);
    // console.log(this.posts);
    // return this.posts.find((p) => {
    //   if (p.id === postid) {
    //     console.log(p);

    //   }
    //   return p.id === postid;
    // });
    return this.http.get<{title: string, content: string , _id: string, imagepath: string , message: string}>(`${url}/${postid}`);
  }

  updatepost(postid: string, post: Post) {
    let formdata;
    if (typeof(post.image) === 'object') {
      formdata = new FormData();
      formdata.append('title', post.title);
      formdata.append('content', post.content);
      formdata.append('image', post.image);
    } else {
      formdata = {
        title: post.title,
        content: post.content,
        image: post.image
      };
    }
    return this.http.put<{body: Post}>(`${url}/${postid}`, formdata)
    .subscribe(res => {
      // updating ui
      // const updp = [...this.posts];
      // console.log(updp);
      // const postindex = this.posts.findIndex(p => p.id === postid);

      // this.posts[postindex] = res.body;

      // console.log(this.posts);
      // this.posts.forEach((p, i) => {
      //   if (p.id === postid) {
      //       this.posts.slice(i, 1);
      //       this.posts[postindex] = post;
      //   }

      // });
      // this.posts = updp;
      // this.newpost.next([...this.posts]);
      this.router.navigate(['/']);

    }, err => {
      this.editvalidation.next(false);
      this.router.navigate(['/']);
    });
  }
  deletepost(postid: string) {
    return this.http.delete<Post>(`${url}/${postid}`);
    // .subscribe(res => {
    //   console.log(res);
    //   console.log(this.posts);
    //   const updposts = this.posts.filter(post => post.id !== postid );
    //   this.posts = updposts;
    //   this.newpost.next({posts: [...this.posts] , count : null});
    //   console.log(this.posts);
    // });
  }
}
