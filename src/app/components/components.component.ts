import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './common/sidebar/sidebar.component';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  templateUrl: './components.component.html',
  styleUrl: './components.component.css'
})
export class ComponentsComponent {

}
