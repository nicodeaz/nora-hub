import React from 'react';
import { Compass } from 'lucide-react';
import { DynamicIcon, type IconName } from 'lucide-react/dynamic';

interface DynamicHubIconProps {
  name: string;
  className?: string;
}

// Card icons are stored as free-text Lucide PascalCase names (e.g. "FolderKanban"),
// but lucide-react's lazy loader keys its icons by kebab-case (e.g. "folder-kanban").
const toKebabCase = (value: string): string =>
  value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// Loads only the single icon a card actually needs instead of bundling the
// entire ~1500-icon library (see HubCard.tsx history: `import * as LucideIcons`
// pulled in every icon and was most of the app's JS bundle size).
export const DynamicHubIcon: React.FC<DynamicHubIconProps> = ({ name, className }) => {
  return (
    <DynamicIcon
      name={toKebabCase(name) as IconName}
      className={className}
      fallback={() => <Compass className={className} />}
    />
  );
};
