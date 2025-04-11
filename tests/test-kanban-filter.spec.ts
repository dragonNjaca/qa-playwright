import { test, expect } from '@playwright/test';

test.describe('Test Kanban Filter', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://jira.trungk18.com/project/board');
    });

    test('Search bar', async ({ page }) => {

        //Click on search bar
        await page.getByRole('textbox').click();
        //Fill search bar with text
        await page.getByRole('textbox').fill('Akita');
        //Check if the text is visible
        await expect(page.getByText('Akita')).toBeVisible();
        
    });

    test('Filter by Ignore Resolved', async ({ page }) => {

        //Click on Ignore Resolved filter button
        await page.getByRole('button', { name: 'Ignore Resolved' }).click();
        await page.waitForTimeout(2000); // Wait for 2 seconds to see the effect of the button click
        //Check Done column tasks are not visible
        const doneColumnEmpty = await page.locator('#Done');
        const doneTasks = await doneColumnEmpty.locator('#Done').all();
        expect(doneTasks.length).toBe(0); // Expect no tasks in the "Done" column

    });

    });