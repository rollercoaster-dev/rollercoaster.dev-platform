# Agent Mode Instructions for Handling Nuxt SSR Testing and File Access

## Overview
This document provides guidelines for the AI agent to:
- Verify that the Nuxt SSR setup is working correctly.
- Confirm that critical UI components (such as the Shadcn button) are rendered as expected.
- Handle file access within the `.cursor` workspace and execute tests to verify system behavior.

## Goals
- **Test the Nuxt SSR Setup:**  
  Verify that the homepage renders properly with SSR, Tailwind CSS is applied, and the Shadcn button is present.

- **File Access Management:**  
  Ensure the agent can read and update files in the `.cursor` directory—especially the test files and task documents.

## File Structure
- **Test File:** `tests/nuxt.test.js`
  - Contains tests for:
    - Basic HTML/SSR rendering.
    - Presence of Tailwind CSS classes.
    - Rendering of a Shadcn button.
- **Agent Configuration Directory:** `.cursor/working/agent/config/`
  - This document is stored here to ensure the agent can refer to it.

## Running the Tests
1. **Installation:**
   - Ensure the following dependencies are installed:
     ```bash
     npm install @nuxt/test-utils --save-dev
     npm install vitest --save-dev
     ```
2. **Test Script:**
   - Add or verify the test script in `package.json`:
     ```json
     {
       "scripts": {
         "test:unit": "vitest"
       }
     }
     ```
3. **Execution:**
   - Run the tests by executing:
     ```bash
     npm run test:unit
     ```
4. **Expected Results:**
   - **Homepage renders successfully:**  
     Confirms that a valid HTML structure (with `<!DOCTYPE html>`) is returned.
   - **Tailwind CSS appears to be applied:**  
     Checks for classes matching `text-` to confirm Tailwind CSS is active.
   - **Shadcn Button renders correctly:**  
     Verifies that a `<button>` with the text "Shadcn Button" is present in the HTML.

## Troubleshooting Guidelines
- **Shadcn Button Not Found:**
  - Verify that your homepage includes the Shadcn button component.
  - If the button text differs, update the regex in `tests/nuxt.test.js` accordingly.
  
- **SSR or Tailwind Test Failures:**
  - Check that the Nuxt app is configured correctly.
  - Make sure your dependencies and configurations in `nuxt.config.ts` are up to date.

- **File Access Issues:**
  - Confirm that file permissions and paths in `.cursor` are correctly set.
  - Use explicit file commands (open, edit, etc.) as defined in prior agent instructions.

## Agent Behavior Instructions
- **Context Switching:**  
  When test results are available, if a test fails, update the task file with error details and suggest corrective actions.
  
- **Reporting Results:**  
  Present clear summaries of:
  - Success or failure of each test.
  - Next steps for remediation if any issues are detected.
  
- **Maintaining State:**  
  Continuously update this instruction document if new requirements or troubleshooting steps emerge.

---

By following these instructions, the agent can autonomously handle the verification of the Nuxt SSR setup and manage related file operations effectively. 