import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/api-response.model';
import { ToolCategory } from '../models/toolcategory.model';

@Injectable({
  providedIn: 'root',
})
export class ToolCatalogService {
  private apiUrl = `${environment.apiUrl}/tool-category/get-all`;

  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<ApiResponse<ToolCategory[]>> {
    return this.http.get<ApiResponse<ToolCategory[]>>(this.apiUrl);
  }
}
