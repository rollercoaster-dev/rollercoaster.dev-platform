# MVP User Flows

This document outlines the key user flows for the Rollercoaster.dev MVP, focusing on the core Open Badges functionality.

## User Registration and Onboarding

### New User Registration

1. User navigates to the registration page
2. User enters email, name, and password
3. System validates input and creates account
4. System sends verification email
5. User verifies email address
6. User is directed to complete profile
7. User selects role (issuer or earner)
8. User completes profile information
9. User is directed to dashboard

### User Login

1. User navigates to login page
2. User enters email and password
3. System validates credentials
4. User is directed to dashboard
5. System restores user session and preferences

## Badge Creation Flow

### Creating a New Badge

1. Issuer navigates to "Create Badge" page
2. Issuer enters badge details:
   - Name
   - Description
   - Criteria
   - Tags/categories
3. Issuer uploads badge image
4. System provides image cropping/adjustment tools
5. Issuer previews badge
6. Issuer submits badge for creation
7. System validates and creates badge
8. System confirms successful creation
9. Issuer is directed to badge detail page

### Editing an Existing Badge

1. Issuer navigates to badge management
2. Issuer selects badge to edit
3. System loads badge details in edit form
4. Issuer makes desired changes
5. Issuer previews updated badge
6. Issuer submits changes
7. System validates and updates badge
8. System confirms successful update

## Badge Issuance Flow

### Issuing a Badge to an Individual

1. Issuer navigates to badge detail page
2. Issuer selects "Issue Badge" option
3. Issuer enters recipient email
4. Issuer adds evidence (optional)
5. Issuer adds personal message (optional)
6. Issuer submits issuance request
7. System validates and creates assertion
8. System sends notification to recipient
9. System confirms successful issuance

### Batch Issuance

1. Issuer navigates to "Batch Issue" page
2. Issuer selects badge to issue
3. Issuer uploads CSV with recipient information
4. System validates recipient data
5. Issuer reviews recipient list
6. Issuer submits batch issuance request
7. System processes issuances in background
8. System sends notifications to recipients
9. System provides issuance status report

## Badge Acceptance Flow

### Accepting a Badge

1. Recipient receives email notification
2. Recipient clicks link in email
3. System directs to badge acceptance page
4. Recipient reviews badge details
5. Recipient chooses to accept or decline
6. If accepted, badge is added to recipient's collection
7. System confirms acceptance
8. Recipient is directed to their badge collection

### Viewing Earned Badges

1. User navigates to profile or badge collection
2. System displays all earned badges
3. User can filter or sort badges
4. User selects a badge to view details
5. System displays badge details and evidence
6. User can choose to share badge

## Badge Verification Flow

### Verifying a Badge

1. Viewer accesses badge verification URL
2. System retrieves badge assertion data
3. System validates digital signature
4. System checks revocation status
5. System displays verification results
6. Viewer sees badge details and verification status
7. Viewer can see evidence if available

## User Profile Management

### Updating Profile

1. User navigates to profile settings
2. User edits profile information
3. User uploads or changes profile picture
4. User updates privacy preferences
5. User saves changes
6. System validates and updates profile
7. System confirms successful update

### Managing Badge Privacy

1. User navigates to badge collection
2. User selects badge to manage
3. User adjusts visibility settings:
   - Public (visible to everyone)
   - Private (visible only to user)
   - Selective (visible to specific users)
4. User saves privacy settings
5. System updates badge visibility
6. System confirms successful update

## Badge Sharing Flow

### Sharing a Badge

1. User navigates to badge detail
2. User selects "Share Badge" option
3. System provides sharing options:
   - Direct link
   - Email
   - Social media platforms
4. User selects sharing method
5. User customizes sharing message (optional)
6. User completes sharing action
7. System generates appropriate sharing format
8. System confirms successful sharing

## Administrator Flows

### User Management

1. Admin navigates to user management
2. System displays list of users
3. Admin can filter or search for users
4. Admin selects user to manage
5. Admin can:
   - Edit user details
   - Change user role
   - Disable/enable account
   - Delete account
6. Admin submits changes
7. System applies changes
8. System confirms successful action

### Badge Management

1. Admin navigates to badge management
2. System displays list of all badges
3. Admin can filter or search for badges
4. Admin selects badge to manage
5. Admin can:
   - Edit badge details
   - Approve/reject badge
   - Disable/enable badge
   - Delete badge
6. Admin submits changes
7. System applies changes
8. System confirms successful action

## Error Handling Flows

### Form Validation Errors

1. User submits form with invalid data
2. System identifies validation errors
3. System highlights problematic fields
4. System provides specific error messages
5. User corrects errors
6. User resubmits form
7. System validates and processes form

### Authentication Errors

1. User attempts login with incorrect credentials
2. System displays authentication error
3. System provides password reset option
4. User can retry or reset password
5. System limits failed attempts to prevent abuse

### Permission Errors

1. User attempts action without proper permissions
2. System blocks action
3. System displays permission error message
4. System suggests appropriate next steps
5. User is directed to permitted actions

## Password Management

### Password Reset

1. User selects "Forgot Password" option
2. User enters email address
3. System sends password reset link
4. User clicks link in email
5. User enters new password
6. System validates password strength
7. System updates password
8. System confirms successful reset
9. User is directed to login

### Changing Password

1. User navigates to account settings
2. User selects "Change Password" option
3. User enters current password
4. User enters and confirms new password
5. System validates password strength
6. System updates password
7. System confirms successful change

## Feedback and Support

### Submitting Feedback

1. User selects feedback option
2. System displays feedback form
3. User enters feedback details
4. User submits feedback
5. System records feedback
6. System confirms receipt
7. System notifies administrators

### Accessing Help

1. User selects help option
2. System displays help resources:
   - FAQ
   - Documentation
   - Contact support
3. User browses help content
4. User can search for specific topics
5. User can contact support if needed
