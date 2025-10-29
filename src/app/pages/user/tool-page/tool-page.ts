import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToolService } from '../../../common/services/tool.service';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tool-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tool-page.html',
  styleUrls: ['./tool-page.css'],
})
export class ToolPage implements OnInit, OnDestroy {
  subCategoryId!: string;
  tools: any[] = [];
  loading = false;
  error: string | null = null;

  page = 1;
  pageSize = 12;
  totalCount = 0;
  totalPages = 0;
  sortBy = 'name';
  search = '';

  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService
  ) {}

  ngOnInit() {
    this.routeSub = this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        distinctUntilChanged()
      )
      .subscribe((id) => {
        if (id) {
          this.subCategoryId = id;
          this.page = 1;
          this.error = null;
          this.tools = [];
          this.fetchTools();
        }
      });
  }

  fetchTools() {
    this.loading = true;
    this.error = null;
    this.tools = [];

    this.toolService
      .getToolsBySubCategory(this.subCategoryId, this.page, this.pageSize, this.sortBy, this.search)
      .subscribe({
        next: (res) => {
          this.loading = false;
          const items = res?.data?.items ?? [];
          if (items.length > 0) {
            this.tools = items;
            this.totalCount = res.data.totalCount;
            this.totalPages = res.data.totalPages;
          } else {
            this.tools = [];
            this.error = 'No tools found for this category.';
          }
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
          this.tools = [];
          this.error = 'Failed to load tools. Please try again later.';
        },
      });
  }

  searchTools() {
    this.page = 1;
    this.fetchTools();
  }

  changeSort(event: any) {
    this.sortBy = event.target.value;
    this.fetchTools();
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.fetchTools();
    }
  }

  goBackToUser() {
    this.router.navigate(['/user']);
  }

  viewToolDetails(toolId: string) {
    this.router.navigate(['user/tool', toolId], {
      queryParams: { subCategoryId: this.subCategoryId },
    });
  }

  getConditionText(condition: number): string {
    const conditions = ['Available', 'Excellent', 'Good', 'Fair', 'Poor'];
    return conditions[condition] || 'Available';
  }

  getConditionClass(condition: number): string {
    const classes = ['available', 'excellent', 'good', 'fair', 'poor'];
    return classes[condition] || 'available';
  }

  getRatingStars(rating: number = 4.5): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) stars.push('full');
    if (hasHalfStar) stars.push('half');
    while (stars.length < 5) stars.push('empty');

    return stars;
  }

  bookTool(tool: any, event: Event) {
    event.stopPropagation();
    console.log('Booking tool:', tool);
  }

  ngOnDestroy() {
    if (this.routeSub) this.routeSub.unsubscribe();
  }
}
