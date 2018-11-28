// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCQ4K1yeKslhtm6HJL9KQ_6ylcmP1Z56cc',
    authDomain: 'mi-natura-web.firebaseapp.com',
    databaseURL: 'https://mi-natura-web.firebaseio.com',
    projectId: 'mi-natura-web',
    storageBucket: 'mi-natura-web.appspot.com',
    messagingSenderId: '520331211571'
  },
  server: 'http://54.188.33.142:8080'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
