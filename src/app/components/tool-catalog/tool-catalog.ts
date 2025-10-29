import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ToolCategory } from '../../common/models/toolcategory.model';
import { SubCategory } from '../../common/models/subcategory.model';
import { ToolCatalogService } from '../../common/services/toolcategory.service';
import { Tool } from '../../common/models/tool.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tool-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tool-catalog.html',
  styleUrls: ['./tool-catalog.css'],
})
export class ToolCatalog implements OnInit, OnDestroy {
  categories: ToolCategory[] = [];
  filteredCategories: ToolCategory[] = [];
  selectedCategory: ToolCategory | null = null;
  selectedSubCategory: SubCategory | null = null;
  loading = true;
  error: string | null = null;

  searchQuery = '';
  selectedPriceRange = 'all';
  selectedCondition = 'all';
  sortBy = 'name';

  dropdownStates: { [key: string]: boolean } = {};

  private routerSubscription?: Subscription;

  priceRanges = [
    { label: 'All Prices', value: 'all', min: 0, max: Infinity },
    { label: 'Under ₹5,000', value: 'under5k', min: 0, max: 5000 },
    { label: '₹5,000 - ₹15,000', value: '5k-15k', min: 5000, max: 15000 },
    { label: '₹15,000 - ₹50,000', value: '15k-50k', min: 15000, max: 50000 },
    { label: 'Above ₹50,000', value: 'above50k', min: 50000, max: Infinity },
  ];

  constructor(private toolCatalogService: ToolCatalogService, private router: Router) {}

  ngOnInit() {
    this.loadCategories();

    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/user' || event.url === '/user/') {
          this.resetSelections();
        }
      });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private resetSelections() {
    this.selectedCategory = null;
    this.selectedSubCategory = null;
    this.dropdownStates = {};
  }

  loadCategories() {
    this.loading = true;
    this.error = null;

    this.toolCatalogService.getAllCategories().subscribe({
      next: (response) => {
        if (response.success) {
          this.categories = response.data ?? [];
        } else {
          this.categories = [];
          this.error = 'Failed to load categories';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.error = 'Failed to load categories. Please try again.';
        this.loading = false;
      },
    });
  }

  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      this.filteredCategories = [...this.categories];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredCategories = this.categories.filter(
        (category) =>
          category.name.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query) ||
          category.subCategories.some(
            (sub) =>
              sub.name.toLowerCase().includes(query) ||
              sub.description.toLowerCase().includes(query)
          )
      );
    }
  }

  toggleDropdown(categoryId: string) {
    this.dropdownStates[categoryId] = !this.dropdownStates[categoryId];
  }

  isDropdownOpen(categoryId: string): boolean {
    return this.dropdownStates[categoryId] || false;
  }

  selectCategory(category: ToolCategory) {
    this.selectedCategory = category;
    this.selectedSubCategory = null;
  }

  selectSubCategory(subCategory: SubCategory) {
    if (!subCategory?.subToolCategoryId) {
      console.error('Invalid subcategory:', subCategory);
      return;
    }

    this.selectedSubCategory = null;

    this.router.navigate(['/user/subcategory', subCategory.subToolCategoryId, 'tools']);
  }

  getPrimaryImage(tool: Tool): string {
    const primaryImage = tool.toolImages.find((img) => img.isPrimary);
    return primaryImage?.imageUrl || tool.toolImages[0]?.imageUrl || 'assets/placeholder.jpg';
  }

  getConditionText(condition: number): string {
    const conditions = ['Available', 'Excellent', 'Good', 'Fair', 'Poor'];
    return conditions[condition] || 'Unknown';
  }

  getFilteredTools(): Tool[] {
    if (!this.selectedSubCategory) return [];

    let tools = [...this.selectedSubCategory.tools];

    if (this.selectedPriceRange !== 'all') {
      const range = this.priceRanges.find((r) => r.value === this.selectedPriceRange);
      if (range) {
        tools = tools.filter((tool) => tool.dailyRate >= range.min && tool.dailyRate <= range.max);
      }
    }

    if (this.selectedCondition !== 'all') {
      tools = tools.filter((tool) => tool.condition === parseInt(this.selectedCondition));
    }

    switch (this.sortBy) {
      case 'name':
        tools.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-low':
        tools.sort((a, b) => a.dailyRate - b.dailyRate);
        break;
      case 'price-high':
        tools.sort((a, b) => b.dailyRate - a.dailyRate);
        break;
      case 'newest':
        tools.sort((a, b) => b.manufactureYear - a.manufactureYear);
        break;
    }

    return tools;
  }

  clearFilters() {
    this.selectedPriceRange = 'all';
    this.selectedCondition = 'all';
    this.sortBy = 'name';
  }

  rentTool(tool: Tool) {
    console.log('Renting tool:', tool);
  }

  viewToolDetails(tool: Tool) {
    console.log('View tool details:', tool);
  }

  addToFavorites(tool: Tool, event: Event) {
    event.stopPropagation();
    console.log('Add to favorites:', tool);
  }
}
