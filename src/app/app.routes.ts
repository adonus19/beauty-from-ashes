import { Routes } from '@angular/router';

/** Every page exists once and is served at both / (English) and /es (Spanish). */
const pages: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Beauty From Ashes Surgical Ministry',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'get-help',
    title: 'Get Help · Beauty From Ashes',
    loadComponent: () => import('./pages/get-help/get-help').then((m) => m.GetHelp),
  },
  {
    path: 'ask-for-help',
    title: 'Ask for Help · Beauty From Ashes',
    loadComponent: () => import('./pages/ask-for-help/ask-for-help').then((m) => m.AskForHelp),
  },
  {
    path: 'refer',
    title: 'Refer Someone · Beauty From Ashes',
    loadComponent: () => import('./pages/refer/refer').then((m) => m.Refer),
  },
  {
    path: 'volunteer',
    title: 'Volunteer · Beauty From Ashes',
    loadComponent: () => import('./pages/volunteer/volunteer').then((m) => m.Volunteer),
  },
  {
    path: 'partner',
    title: 'Partner · Beauty From Ashes',
    loadComponent: () => import('./pages/partner/partner').then((m) => m.Partner),
  },
  {
    path: 'give',
    title: 'Give · Beauty From Ashes',
    loadComponent: () => import('./pages/give/give').then((m) => m.Give),
  },
  {
    path: 'stories',
    title: 'Stories · Beauty From Ashes',
    loadComponent: () => import('./pages/stories/stories').then((m) => m.Stories),
  },
  {
    path: 'about',
    title: 'About · Beauty From Ashes',
    loadComponent: () => import('./pages/about/about').then((m) => m.About),
  },
  {
    path: 'contact',
    title: 'Contact · Beauty From Ashes',
    loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'privacy',
    title: 'Privacy · Beauty From Ashes',
    data: { content: 'privacy' },
    loadComponent: () => import('./pages/document/document-page').then((m) => m.DocumentPage),
  },
  {
    path: 'accessibility',
    title: 'Accessibility · Beauty From Ashes',
    data: { content: 'accessibility' },
    loadComponent: () => import('./pages/document/document-page').then((m) => m.DocumentPage),
  },
];

export const routes: Routes = [
  { path: 'es', children: pages },
  ...pages,
  { path: '**', redirectTo: '' },
];
