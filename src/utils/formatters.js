export const formatDate = (dateString) => {
  if (!dateString) return 'TBA';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'TBA';
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return dateString;
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
    case 'pending':
      return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20';
    case 'rejected':
      return 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20';
    default:
      return 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20';
  }
};

export const getRoleBadgeClass = (role) => {
  switch (role?.toLowerCase()) {
    case 'admin':
      // Terracotta = the brand primary (warm orange-brown).
      return 'bg-terracotta-50 text-terracotta-700 ring-1 ring-inset ring-terracotta-600/20';
    case 'exhibitor':
      // Olive = the project's secondary warm accent (visually distinct from terracotta).
      return 'bg-olive-50 text-olive-700 ring-1 ring-inset ring-olive-600/20';
    case 'attendee':
      return 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20';
    default:
      return 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20';
  }
};
