// src/utils/usePermission.js
const permissions = {
    member: ['register', 'login', 'view_societies', 'vote'],
    officer: ['register', 'login', 'view_societies', 'vote', 'view_results'],
    employee: ['register', 'login', 'view_societies', 'vote', 'manage_ballots', 'monitor_election'],
    admin: [
      'register', 'login', 'view_societies', 'vote',
      'view_results', 'manage_users', 'manage_ballots',
      'monitor_election', 'view_logs', 'manage_societies'
    ]
  };
  
  export function hasPermission(action) {
    const role = localStorage.getItem('role');
    return permissions[role]?.includes(action);
  }
  