import {Component, OnInit} from '@angular/core';
import {Book} from '../model/book';
import {NotificationService} from '../service/notification.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BookService} from '../book.service';
import {AuthorService} from '../service/author.service';
import {Observable, throwError} from 'rxjs';
import {Author} from "../model/author";

@Component({
  selector: 'app-create-author',
  templateUrl: './create-author.component.html',
  styleUrls: ['./create-author.component.scss']
})
export class CreateAuthorComponent implements OnInit {

  public submitted: boolean = false;

  id: number;
  // book: Book;
  author: Author;

 // books: Observable<Book[]>;
 // authors: Observable<Author[]>;
  authors: Author[];
  books: Book[];

  data: any;
  interval: any;

  constructor(private notifyService: NotificationService,
              private route: ActivatedRoute,
              private router: Router,
              private bookService: BookService,
              private authorService: AuthorService) {
  }

  ngOnInit() {
  //  this.book = new Book();
    this.author = new Author();

    this.id = this.route.snapshot.params['id'];

    this.bookService.getBook(this.id).subscribe();
    this.list2(this.id);
    //
    // this.authorService.getAuthorList(this.id).subscribe();
    // this.authorService.getAuthorList(this.id).subscribe();

    // refresh the data in a component page after 10 seconds
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(
      () => {
        this.reloadData();
      }, 10000
    );
  }

  newAuthor(): void {
    this.submitted = false;
  }

  addAuthor() {
    console.log('id.....', this.id);
 //   this.authorService.createAuthor(this.book).subscribe(
   // this.authorService.createAuthor(this.author).subscribe(
    this.authorService.createAuthor(this.id).subscribe(
      data => {
        this.reloadData();
      },
      error => {
        this.handleError(error);
        this.notifyService.showError('Author not added.', 'Yannitech BookStore');
      },
      () => {
        this.notifyService.showSuccess('Author added successfully.', 'Yannitech BookStore');
      }
    );
  }

  onSubmit(data) {
    console.log('au', data);
    this.addAuthor();
  }

  // routing
  gotoList() {
    this.router.navigate(['/addAuthor']);
  }

  // routing
  list() {
    this.router.navigate(['books']);
  }

  reloadData() {
   // this.books = this.authorService.getAuthorList(this.id);
   // this.authors = this.authorService.getAuthorList(this.id);
  }

  deleteAuthor(id: number) {
    this.authorService.deleteAuthor(id).subscribe(
      data => {
        console.log('Observer got a next value: ' + data);
        this.reloadData();
      },
      error => {
        console.error('Observer got an error: ' + error);
        this.handleError(error);
        this.notifyService.showError('Author delete unsuccessful.', 'Yannitech BookStore');
      },
      () => {
        console.log('Observer got a complete notification');
        this.notifyService.showSuccess('Author delete successful.', 'Yannitech BookStore');
      }
    );
  }

  list2(id: number){
    this.authorService.getAuthorList(id).subscribe(
      data => {
        this.authors = data;
      }
    );
  }
  // error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
      console.log('client-side error ' + errorMessage);
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      console.log('server-side error ' + errorMessage);
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
