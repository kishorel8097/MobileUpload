import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-expandable-table",
  templateUrl: "./simple-expandable-table.component.html",
  styleUrls: ["./simple-expandable-table.component.css"],
})
export class SimpleExpandableTableComponent implements OnInit {
  tableData!: any[];

  ngOnInit(): void {
    this.tableData = [
      {
        f1: "Row 1 - Field 1",
        f2: "Row 1 - Field 2",
        f3: "Row 1 - Field 3",
        rowDepth: 1,
        data: [
          {
            f1: "Row 1-1 - Field 1",
            f2: "Row 1-1 - Field 2",
            f3: "Row 1-1 - Field 3",
            rowDepth: 2,
          },
          {
            f1: "Row 1-2 - Field 1",
            f2: "Row 1-2 - Field 2",
            f3: "Row 1-2 - Field 3",
            rowDepth: 2,
            data: [
              {
                f1: "Row 1-2-1 - Field 1",
                f2: "Row 1-2-1 - Field 2",
                f3: "Row 1-2-1 - Field 3",
                rowDepth: 3,
              },
            ],
          },
        ],
      },
      {
        f1: "Row 2 - Field 1",
        f2: "Row 2 - Field 2",
        f3: "Row 2 - Field 3",
        rowDepth: 1,
      },
    ];
  }
}
