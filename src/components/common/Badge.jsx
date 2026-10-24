import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 ring-slate-200',
    primary: 'bg-terracotta-50 text-terracotta-700 ring-terracotta-200',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    warning: 'bg-amber-50 text-amber-700 ring-amber-200',
    danger: 'bg-rose-50 text-rose-700 ring-rose-200',
    purple: 'bg-terracotta-50 text-terracotta-700 ring-terracotta-200',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ring-1 ring-inset ${
        variantStyles[variant] || variantStyles.default
      } ${sizeStyles[size] || sizeStyles.sm}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const norm = (status || '').toLowerCase();
  let variant = 'default';

  if (norm === 'approved') variant = 'success';
  else if (norm === 'pending') variant = 'warning';
  else if (norm === 'rejected') variant = 'danger';

  return <Badge variant={variant}>{status || 'Unknown'}</Badge>;
};

export const RoleBadge = ({ role }) => {
  const norm = (role || '').toLowerCase();
  let variant = 'default';

  if (norm === 'admin') variant = 'purple';
  else if (norm === 'exhibitor') variant = 'primary';
  else if (norm === 'attendee') variant = 'success';

  return <Badge variant={variant}>{role ? role.toUpperCase() : 'USER'}</Badge>;
};

export default Badge;
