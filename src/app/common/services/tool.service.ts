import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tool } from '../models/tool.model';

@Injectable({ providedIn: 'root' })
export class ToolService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tool`;
  private subToolApiUrl = `${environment.apiUrl}/sub-tool-category`;

  getToolsBySubCategory(
    subCategoryId: string,
    page: number = 1,
    pageSize: number = 10,
    sortBy: string = 'name',
    search?: string
  ): Observable<any> {
    let params = new HttpParams()
      .set('subCategoryId', subCategoryId)
      .set('page', page)
      .set('pageSize', pageSize)
      .set('sortBy', sortBy);

    if (search) params = params.set('search', search);

    return this.http.get<any>(`${this.subToolApiUrl}/get-by-subcategoryid`, { params });
  }

  getToolById(toolId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      accept: 'text/plain',
    });

    const params = new HttpParams().set('tooldId', toolId);

    return this.http.get<any>(`${this.apiUrl}/get-by-id`, { headers, params });
  }

  searchTools(query: string): Observable<Tool[]> {
    const params = new HttpParams().set('query', query);

    return this.http
      .get<{ success: boolean; message: string; data: Tool[] }>(`${this.apiUrl}/search`, { params })
      .pipe(map((res) => res.data || []));
  }
}
