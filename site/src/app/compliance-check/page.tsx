import fs from 'fs';
import path from 'path';
import { ComplianceChecker } from '@/components/ComplianceChecker';

function loadSpec(filename: string) {
  const raw = fs.readFileSync(
    path.join(process.cwd(), '..', 'docs', 'data', filename),
    'utf-8'
  );
  return JSON.parse(raw);
}

export default function Page() {
  const clinicEmr = loadSpec('clinic-emr.json');
  const hospitalEmr = loadSpec('hospital-emr.json');
  const clinicRececom = loadSpec('clinic-rececom.json');
  const hospitalRececom = loadSpec('hospital-rececom.json');

  return (
    <ComplianceChecker
      clinicEmr={clinicEmr}
      hospitalEmr={hospitalEmr}
      clinicRececom={clinicRececom}
      hospitalRececom={hospitalRececom}
    />
  );
}

export const metadata = {
  title: '適合性チェック',
};
