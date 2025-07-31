import React, { useEffect } from 'react';
import { icons } from 'lucide-react';

// This component works with the lucide CDN script.
// It creates an <i> tag with a data-lucide attribute, which
// the script then replaces with an SVG icon.
declare global {
  interface Window {
    lucide: any;
  }
}

interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  name: keyof typeof icons;
}

const toKebabCase = (str: string) => {
    return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
};

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  useEffect(() => {
    // Run the lucide script to replace <i> tags with SVGs.
    // This needs to be run anytime an icon might have been added to the DOM.
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });

  // `name` is PascalCase (e.g., "CheckSquare"), but `data-lucide` needs kebab-case (e.g., "check-square").
  const iconNameKebab = toKebabCase(String(name));

  // Render an `<i>` tag which will be picked up by the lucide CDN script.
  return React.createElement('i', { 'data-lucide': iconNameKebab, ...props });
};

export default Icon;
