import React from 'react';
import clsx from 'clsx';

export default function PageContainer({ children, className }) {
  return (
    <div className={clsx("page-container", className)}>
      {children}
    </div>
  );
}
