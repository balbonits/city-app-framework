# UX

## Purpose
Documents user experience workflows and journeys for City App Framework apps.

## Core Tenets
- Mobile-first, responsive design in Arts.
- Intuitive navigation in Districts.
- Accessible components with ARIA (utils/a11y/).
- Feature flagging for A/B testing user flows.

## Workflows
- **Login Flow**:
  - User enters credentials in InputField component.
  - Sanitize input, validate (utils/validation/).
  - Use useAuth hook for secure login.
  - Redirect to dashboard via Districts routing.

- **Theme Toggle Flow**:
  - User clicks toggle button.
  - Use useTheme hook to switch theme.
  - Apply responsive styles from Arts.

- **Settings Update Flow**:
  - User edits settings in SettingsPanel.
  - Validate changes, sanitize input.
  - Update state in Store, track with useAnalytics.

## User Journeys
- **New User**: Landing (CSR/SSG), login, dashboard (CSR), explore features (feature flags).
- **Admin User**: Access admin panel (Districts routing), manage data (Store APIs), monitor performance (analytics in Works).
- **Mobile User**: Responsive layout (Arts), offline support (PWA in Works).

- **Future**: Add journeys for Native/Hybrid apps.