import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToolService } from '../../../common/services/tool.service';
import { FormsModule } from '@angular/forms';
import { Tool } from '../../../common/models/tool.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css'],
})
export class SearchResults implements OnInit {
  tools: Tool[] = [];
  loading = false;
  error: string | null = null;
  query = '';

  constructor(
    private route: ActivatedRoute,
    private toolService: ToolService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.query = params['q'] || '';
      if (this.query.trim()) {
        this.searchTools(this.query);
      }
    });
  }

  searchTools(query: string): void {
    this.loading = true;
    this.error = null;
    this.tools = [];

    this.toolService.searchTools(query).subscribe({
      next: (tools) => {
        this.tools = tools;
        this.error = !tools.length ? `No tools found for "${this.query}".` : null;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Failed to load search results.';
        this.loading = false;
      },
    });
  }

  viewToolDetails(toolId: string): void {
    this.router.navigate(['user/tool', toolId]);
  }
}
