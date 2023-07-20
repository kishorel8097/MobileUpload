import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

import { ButtonModule } from "primeng/button";

import { SimpleExpandableTableComponent } from "./simple-expandable-table/simple-expandable-table.component";
import { TestCmpComponent } from "./test-cmp/test-cmp.component";
import { CanvasImageDataComponent } from "./canvas-image-data/canvas-image-data.component";
import { JsGameDevComponent } from "./js-game-dev/js-game-dev.component";
import { HoldButtonComponent } from "./js-game-dev/hold-button/hold-button.component";

@NgModule({
  declarations: [
    AppComponent,
    SimpleExpandableTableComponent,
    TestCmpComponent,
    CanvasImageDataComponent,
    JsGameDevComponent,
    HoldButtonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
