import { Component } from '@angular/core';

import { ScanPage } from '../scan/scan';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ScanPage;
  tab3Root = ProfilePage;

  constructor() {

  }
}
