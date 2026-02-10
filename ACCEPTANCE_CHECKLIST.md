# Accessibility + Performance Acceptance Checklist

## Accessibility
- [x] Visible `:focus-visible` states on interactive controls
- [x] Modal focus trap + `Escape` close behavior
- [x] Toast stack uses `aria-live` announcements
- [x] Tabs and dropdown expose roles/states for keyboard usage
- [x] Icon-only controls include accessible labels
- [x] Reduced motion support via global media query and `useMotion`

## Interaction Quality
- [x] Brutal button/card hover/active tactile mechanics
- [x] Input validation states include visual + text feedback
- [x] Toast timers are visible and dismissible
- [x] Component set uses consistent border/shadow grammar

## Performance
- [x] Route-level code splitting via Vue Router lazy imports
- [x] Search/filter logic remains reactive and debounced-ready
- [x] Animations use transform/opacity patterns
- [x] Build and type-check pass without errors

## Remaining Next Pass Targets
- [x] Virtualized dashboard list component integration
- [x] Lazy Monaco runtime integration in practice editor
- [ ] Keyboard traversal audit across all list/table flows
