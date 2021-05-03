import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'polaris-navigation-item',
    templateUrl: './navigation-item.component.html',
    styleUrls: ['./navigation-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationItemComponent {

    @Input()
    title: string;

    @Input()
    icon: string;

    @Input()
    routerLink: RouterLink;

}
