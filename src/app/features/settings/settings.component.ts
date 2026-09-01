import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
  selector: "app-settings",
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./settings.component.html",
  styleUrl: "./settings.component.scss",
})
export class SettingsComponent {}
