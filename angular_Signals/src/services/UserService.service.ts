// import { HttpClient, HttpResponse } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import {
//   BehaviorSubject,
//   catchError,
//   filter,
//   finalize,
//   map,
//   Observable,
//   of,
//   shareReplay,
//   switchMap,
//   tap,
// } from 'rxjs';
// // import {ICurrentUser,IEmployeeAccount,IEmployeeDetails,IEmployerAccount,ILogin,IEduStaffyClients,
// // } from '../_models/user.model';
// import { Router } from '@angular/router';
// // import { BASE_URL } from '../../../_common/common';
// // import {IPagedResponse,  IResponseMessage,} from '../../shared/_models/shared.model';
// // import { Role } from '../../shared/_enums/enums';
// // import { IEmployeeProfileDetails } from '../../core/_models/core.model';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService {
//   currentUserSource = new BehaviorSubject<ICurrentUser | null>(null);
//   currentUser$ = this.currentUserSource.asObservable();
//   private refreshTokenInProgress$?: Observable<string | null>;

//   constructor(private httpClient: HttpClient, private router: Router) {}

//   signIn(login: ILogin): Observable<{
//     uId: string;
//     email: string;
//     token: string;
//     cId: string;
//     sId: string;
//     zId: string;
//     profilePictureUrl: string;
//   }> {
//     return this.httpClient.post<{
//       uId: string;
//       email: string;
//       token: string;
//       cId: string;
//       sId: string;
//       zId: string;
//       profilePictureUrl: string;
//     }>(BASE_URL + 'User/SignIn', login);
//   }

//   forgetPassword(email: string): Observable<HttpResponse<IResponseMessage>> {
//     return this.httpClient.post<IResponseMessage>(
//       BASE_URL + `User/ForgotPassword`,
//       {
//         email,
//       },
//       {
//         observe: 'response',
//       }
//     );
//   }

//   refreshAccessToken(): Observable<string | null> {
//     // If the refresh token request is already in progress, just return the ongoing observable
//     if (this.refreshTokenInProgress$) {
//       return this.refreshTokenInProgress$; // 🛑 Prevent duplicate refresh token requests
//     }

//     const currentUser = this.currentUserSource.value;
//     if (!currentUser) return of(null);

//     const url = BASE_URL + `User/refreshToken`;

//     const payload = {
//       token: currentUser.token, // Send expired access token here
//     };

//     // Start the refresh token process
//     this.refreshTokenInProgress$ = this.httpClient
//       .post<{ token: string }>(url, payload, { withCredentials: true })
//       .pipe(
//         tap((response) => {
//           console.log('old token', currentUser.token);
//           if (response?.token) {
//             console.log('new token', response.token);
//             const updatedUser: ICurrentUser = {
//               ...currentUser,
//               token: response.token,
//             };
//             this.currentUserSource.next(updatedUser);
//             this.setLocalStorage(updatedUser);
//           } else {
//             console.warn('Invalid token refresh response', response);
//           }
//         }),
//         map((res) => res?.token ?? null),
//         catchError((err) => {
//           console.error('Refresh token failed', err);

//           if (err.status === 401 || err.status === 403) {
//             this.logout();
//           }

//           return of(null);
//         }),
//         shareReplay(1), // Share the result so other requests can wait for the refresh to complete
//         finalize(() => {
//           this.refreshTokenInProgress$ = undefined; // Reset after refresh process completes
//         })
//       );

//     return this.refreshTokenInProgress$;
//   }

//   getToken(): string | null {
//     return this.currentUserSource.value?.token ?? null;
//   }

//   isTokenExpired(): boolean {
//     const token = this.getToken();
//     if (!token) return true;

//     const payload = JSON.parse(atob(token.split('.')[1]));
//     const now = Math.floor(Date.now() / 1000);
//     return payload.exp < now;
//   }

//   setLocalStorage(user: ICurrentUser): void {
//     localStorage.setItem('user', JSON.stringify(user));
//   }

//   removeLocalStorage(): void {
//     localStorage.removeItem('user');
//   }

//   getUserRole(token: string): string | null {
//     const decodedToken = this.decodeToken(token);
//     return decodedToken ? decodedToken.Role : null;
//   }

//   private decodeToken(token: string): any {
//     try {
//       const payload = token.split('.')[1];
//       return JSON.parse(atob(payload));
//     } catch (error) {
//       return null;
//     }
//   }

//   logout(): void {
//     this.currentUserSource.next(null);
//     this.removeLocalStorage();
//     this.router.navigateByUrl('/');
//   }

//   autoLogin(): void {
//     const userJson = localStorage.getItem('user');
//     const user: ICurrentUser | null = userJson ? JSON.parse(userJson) : null;

//     if (user) {
//       const role = this.getUserRole(user.token);
//       const currentUser: ICurrentUser = {
//         uId: user.uId,
//         email: user.email,
//         token: user.token,
//         role: role || 'Guest',
//         cId: user.cId,
//         sId: user.sId,
//         zId: user.zId,
//         profilePictureUrl: user.profilePictureUrl,
//       };
//       this.currentUserSource.next(currentUser);
//     }
//     // else {
//     //   this.logout();
//     // }
//   }
// }
