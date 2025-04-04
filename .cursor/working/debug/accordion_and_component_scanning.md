# Accordion Component and Component Scanning Issues

## Error Messages

- Warning: "Components not scanned from ~/components/RD. Did you mean to name the directory ~/components/rd instead?"
- Accordion component not functioning in browser (reported by user)

## Recent Changes

- Installed Accordion component using shadcn-vue
- Modified imports in index.vue to use relative paths
- Component structure changes for RD components

## Potentially Involved Files

1. frontend/pages/index.vue
   - Contains Accordion implementation
   - Uses RD components
2. frontend/components/ui/accordion/\*
   - Core Accordion component files
3. frontend/nuxt.config.ts
   - Component auto-import configuration
4. frontend/components/RD vs rd
   - Directory casing issue

## Current State

Working:

- Accordion component files are present
- Basic page structure renders
- Separator components working

Not Working:

- Accordion component not functioning
- RD components not being scanned properly

## Investigation Plan

1. Check component directory structure
2. Verify nuxt.config.ts component configuration
3. Fix RD/rd directory casing
4. Test Accordion imports and functionality
5. Verify all required dependencies

## Hypothesis

The component scanning issue with RD/rd casing is likely causing cascading problems with component registration and may be affecting the Accordion functionality.

## Proposed Debug Steps

1. Check current component directory structure
2. Fix RD/rd directory casing
3. Update component imports to match new structure
4. Clear nuxt build cache and restart dev server
5. Test Accordion functionality

## Progress Made

1. ✅ Fixed RD/rd directory casing issue

   - Removed uppercase RD directory
   - Created lowercase rd directory
   - Updated component imports in index.vue

2. ✅ Updated component imports

   - Changed from relative imports to #components auto-imports
   - This should properly utilize Nuxt's auto-import system

3. ✅ Cleared build cache
   - Removed .nuxt directory
   - Restarted dev server

## Next Steps

1. Verify that the RD components are now being properly scanned
2. Check if the Accordion component is functioning
3. If issues persist:
   - Check browser console for errors
   - Verify component registration in Vue devtools
   - Check if other shadcn components are working

## Current Status

Waiting for dev server to restart to verify changes.

## Notes

- The casing issue with RD/rd directory was likely causing component scanning issues
- Using #components for imports should better integrate with Nuxt's auto-import system
- Need to verify if this resolves both the RD component scanning and Accordion functionality
