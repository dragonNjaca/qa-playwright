import { test, expect } from '@playwright/test';

test.describe('Test Kanban Socials', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://jira.trungk18.com/project/board');
    });

    test('Support button and URL', async ({ page, context }) => {

        // Set up a listener for new pages before clicking the button
        const pagePromise = context.waitForEvent('page');
        // Click the button that should open a new tab
        await page.getByRole('button', { name: 'Support' }).click(); 
        // Wait for the new page to open
        const newPage = await pagePromise;
        // Wait for the new page to load
        await newPage.waitForLoadState('networkidle');
        // Verify the URL of the new tab
        const newUrl = newPage.url();
        expect(newUrl).toContain('https://buymeacoffee.com/trungvose'); 
        // Check if the new page title is correct
        const pageTitle = await newPage.title();
        expect(pageTitle).toContain('Trung Vo');

      });



});