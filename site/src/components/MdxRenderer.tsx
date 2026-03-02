import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { RequirementCard } from '@/components/content/RequirementCard';
import { RequirementSummary } from '@/components/content/RequirementSummary';
import { ComparisonTable } from '@/components/content/ComparisonTable';
import { ApiSpecTable } from '@/components/content/ApiSpecTable';
import { WorkflowStep } from '@/components/content/WorkflowStep';
import { GlossaryEntry } from '@/components/content/GlossaryEntry';
import { GlossarySearch } from '@/components/content/GlossarySearch';
import {
  SystemDiagram,
  PrescriptionWorkflowDiagram,
  AuthFlowDiagram,
  NetworkDiagram,
  RequirementTypeBadge,
} from '@/components/diagrams';

const components = {
  RequirementCard,
  RequirementSummary,
  ComparisonTable,
  ApiSpecTable,
  WorkflowStep,
  GlossaryEntry,
  GlossarySearch,
  SystemDiagram,
  PrescriptionWorkflowDiagram,
  AuthFlowDiagram,
  NetworkDiagram,
  RequirementTypeBadge,
};

interface MdxRendererProps {
  source: string;
}

export function MdxRenderer({ source }: MdxRendererProps) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  );
}
