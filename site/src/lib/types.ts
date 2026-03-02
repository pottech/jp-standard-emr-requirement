export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: "遵守" | "推奨" | "不可" | "参考";
  section: string;
  details: string;
  notes?: string;
}

export interface NavItem {
  title: string;
  path: string;
  order?: number;
  children?: NavItem[];
}

export interface ContentData {
  frontmatter: Record<string, unknown>;
  content: string;
}

export interface MetadataJson {
  siteTitle: string;
  siteDescription: string;
  navigation: NavItem[];
  sourceDocuments: SourceDocument[];
  requirementTypes: RequirementType[];
}

export interface SourceDocument {
  id: string;
  title: string;
  publisher: string;
  version?: string;
  lastUpdated?: string;
  sections: string[];
}

export interface RequirementType {
  id: string;
  label: string;
  description: string;
  color: string;
}
