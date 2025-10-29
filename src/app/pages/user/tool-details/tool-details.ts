import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToolCondition } from '../../../enums/ToolCondition';
import { ToolService } from '../../../common/services/tool.service';

@Component({
  selector: 'app-tool-details',
  standalone: true,
  templateUrl: './tool-details.html',
  styleUrls: ['./tool-details.css'],
  imports: [CommonModule, FormsModule],
})
export class ToolDetails implements OnInit {
  tool = signal<any | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  selectedImage = signal<string>('');
  selectedImageIndex = signal<number>(0);

  rentalDuration = 'daily';
  startDate = '';
  endDate = '';
  quantity = 1;

  checkingAvailability = signal(false);
  isAvailable = signal<boolean | null>(null);

  subCategoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toolService: ToolService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.subCategoryId = this.route.snapshot.queryParamMap.get('subCategoryId');
    if (id) this.fetchTool(id);
  }

  /** 🔹 Fetch tool details (updated for single tool object) */
  fetchTool(id: string) {
    this.loading.set(true);
    this.toolService.getToolById(id).subscribe({
      next: (response) => {
        const toolData = response?.data;

        if (toolData) {
          // ✅ Ensure numeric condition value
          toolData.condition = Number(toolData.condition);

          console.log('Tool fetched:', toolData);
          console.log('Condition:', this.getConditionText(toolData.condition));

          this.tool.set(toolData);

          // ✅ Default image to first available
          if (toolData.toolImages?.length > 0) {
            this.selectedImage.set(toolData.toolImages[0].imageUrl);
          }
        } else {
          this.error.set('Tool not found.');
        }

        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching tool:', err);
        this.error.set('Failed to load tool details.');
        this.loading.set(false);
      },
    });
  }

  /** 🔹 Back button */
  goBack() {
    if (this.subCategoryId) {
      this.router.navigate(['/user/subcategory', this.subCategoryId, 'tools']);
    } else {
      this.router.navigate(['/user']);
    }
  }

  /** 🔹 Image selector */
  selectImage(imageUrl: string, index: number) {
    this.selectedImage.set(imageUrl);
    this.selectedImageIndex.set(index);
  }

  /** 🔹 Condition display text */
  getConditionText(condition?: ToolCondition): string {
    switch (condition) {
      case ToolCondition.New:
        return 'New';
      case ToolCondition.Excellent:
        return 'Excellent';
      case ToolCondition.Good:
        return 'Good';
      case ToolCondition.Fair:
        return 'Fair';
      case ToolCondition.Poor:
        return 'Poor';
      default:
        return 'Unknown';
    }
  }

  /** 🔹 Condition badge color */
  getConditionClass(condition?: ToolCondition): string {
    switch (condition) {
      case ToolCondition.New:
        return 'condition-new';
      case ToolCondition.Excellent:
      case ToolCondition.Good:
        return 'condition-good';
      case ToolCondition.Fair:
        return 'condition-fair';
      case ToolCondition.Poor:
        return 'condition-poor';
      default:
        return '';
    }
  }

  /** 🔹 Calculate total price */
  getTotalPrice(): number {
    const tool = this.tool();
    if (!tool) return 0;

    let rate = 0;
    switch (this.rentalDuration) {
      case 'hourly':
        rate = tool.hourlyRate;
        break;
      case 'daily':
        rate = tool.dailyRate;
        break;
      case 'weekly':
        rate = tool.weeklyRate;
        break;
      case 'monthly':
        rate = tool.monthlyRate;
        break;
    }
    return rate * this.quantity;
  }

  /** 🔹 Check availability (mock for now) */
  onDateChange() {
    if (this.startDate && this.endDate) {
      this.checkingAvailability.set(true);
      setTimeout(() => {
        this.isAvailable.set(Math.random() > 0.5);
        this.checkingAvailability.set(false);
      }, 1000);
    }
  }

  /** 🔹 Book & Favorites */
  bookTool() {
    alert('Booking feature coming soon!');
  }

  addToFavorites() {
    alert('Added to favorites!');
  }
}
