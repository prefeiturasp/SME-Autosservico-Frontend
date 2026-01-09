export interface WorkItem {
  id: number;
  title: string;
  state?: string;
  work_item_type?: string;
  tags?: string;
  created_by?: string;
  assigned_to?: string;
  area_path?: string;
  team_project?: string;
  iteration_path?: string;
  completed_work?: number;
  original_estimate?: number;
  start_date?: string;
  finish_date?: string;
  created_date?: string;
  changed_date?: string;
  closed_date?: string;
  parent_id?: number;
  parent_link?: string;
}

export interface BacklogResponse {
  total_items: number;
  parents: WorkItem[];
  children: WorkItem[];
  metadata: Record<string, unknown>;
}
