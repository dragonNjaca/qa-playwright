import { test, expect } from '@playwright/test';

test.describe('Test Kanban Tasks', () => {

test.beforeEach(async ({ page }) => {
    await page.goto('https://jira.trungk18.com/project/board');
});

test('Check if Save button is disabled', async ({ page }) => {
  //Create issue button
  await page.getByRole('complementary').locator('svg').nth(2).click();
  //Get the Save button disabled state
  const isSaveButtonDisabled = await page.getByRole('button', { name: 'Create Issue' }).isDisabled();
  // Check if the button is disabled
  expect(isSaveButtonDisabled).toBe(true);
});

test('Create issue', async ({ page }) => {
  await createIssue(page);
  await checkIssueCreated(page);
});

//Edit issue title and description
test('Edit issue', async ({ page }) => {
  await createIssue(page);
  await editIssue(page);
  await verifyIssueEdited(page); 
});

//Move issue to another column
test('Move issue to another column', async ({ page }) => {
  await createIssue(page);
  //Move issue
  await moveIssue(page);
  //await moveIssue(page);
  await checkIsIssueMoved(page);
});

//Delete issue
test('Delete issue', async ({ page }) => {
    await createIssue(page);
    await deleteIssue(page);
    await checkIfIssueDeleted(page);
});

// Function to create an issue
async function createIssue(page) {
  // Click on the complementary section
  await page.getByRole('complementary').locator('svg').nth(2).click();

  // Fill the short summary (title)
  await page.locator('#cdk-overlay-0 form div').filter({ hasText: 'Short summary' }).getByRole('textbox').click();
  await page.locator('#cdk-overlay-0 form div').filter({ hasText: 'Short summary' }).getByRole('textbox').fill('Task title test');

  // Set description
  await page.getByRole('paragraph').filter({ hasText: /^$/ }).click();
  await page.locator('quill-editor div').nth(2).fill('Description text');
  await page.waitForTimeout(1000);

  // Select reporter
  await page.locator('j-user div').filter({ hasText: 'Trung Vo' }).click();
  await page.locator('j-user').filter({ hasText: 'Iron Man' }).locator('div').first().click();
  await page.waitForTimeout(1000);

  // Set a priority or some other dropdown selection
  await page.locator('nz-select-top-control').filter({ hasText: '[object Text]' }).click();
  await page.getByTitle('Spider Man').locator('div').nth(1).click();
  await page.waitForTimeout(1000);

  // Click the 'Create Issue' button
  await page.getByRole('button', { name: 'Create Issue' }).click();

  // Wait for the issue to be created and visible
  await page.getByText('Task title test').waitFor({ state: 'visible' });
}

// Function to check if the issue is created
async function checkIssueCreated(page) {
  // Assert that the issue is created and displayed
  const issueTitle = await page.getByText('Task title test');
  await expect(issueTitle).toBeVisible();

  //Expect the issue title, description, reporter and +Add Assignee button to be visible
  await page.getByText('Task title test Task-').click();

  //Check if the issue title is visible
  const title = page.getByText('Task title test');
  await expect(title).toBeVisible();

  //Check if the issue description is visible
  const description = page.getByText('Description text');
  await page.waitForTimeout(2000); // Wait for 2 seconds
  expect(description).toBeVisible();

  //Check if the issue reporter is visible
  const reporter = page.getByRole('button', { name: 'Iron Man' });
  const nameReporter = await reporter.textContent();
  expect(nameReporter).toContain('Iron Man');

  //Check if the +Add Assignee button is visible
  const asigneeButton = page.getByText('Add Assignee');
  const nameAsigneeButton = await asigneeButton.textContent();
  expect(nameAsigneeButton).toContain('Add Assignee');
}

// Function to create an issue
async function editIssue(page) {
  await page.getByText('Task title test Task-').click();

  await page.getByRole('paragraph').filter({ hasText: 'Description text' }).click();
  await page.locator('quill-editor div').nth(2).fill('Edit description text');
  //await page.locator('div').filter({ hasText: /^Description$/ }).nth(2).fill('Edit description text');

  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(2000);

  await page.locator('issue-title').getByRole('textbox').click();
  await page.locator('issue-title').getByRole('textbox').fill('Edit title test');
  await page.waitForTimeout(2000);

  // Edit reporter
  await page.getByRole('button', { name: 'Iron Man' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Thor' }).click();
  await page.waitForTimeout(2000);

  // Add assignee
  await page.getByText('Add Assignee').click();
  await page.getByRole('listitem').filter({ hasText: 'Captain'}).click();
  await page.waitForTimeout(2000);

  // Edit task priority
  await page.getByRole('button', { name: 'Medium' }).click();
  await page.getByRole('listitem').filter({ hasText: 'Highest' }).click();
  await page.waitForTimeout(2000);

  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
}

// Function to check if the issue is created
async function verifyIssueEdited(page) {
  await page.getByText('Task title test Task-').click();
  // Assert that the issue is created and displayed
  const updatedTitle = await page.getByText('Task title test Task-');
  await expect(updatedTitle).toBeVisible();

  const updatedDescription = await page.getByText('Edit description text');
  await page.waitForTimeout(2000);
  await expect(updatedDescription).toBeVisible();

  const editedReporter = page.getByRole('button', { name: 'Thor' });
  const nameReporter = await editedReporter.textContent();
  expect(nameReporter).toContain('Thor');

  const addedAssignee = page.getByRole('button', { name: 'Captain'});
  const nameAssignee = await addedAssignee.textContent();
  expect(nameAssignee).toContain('Captain');

  const editedTaskPriority = page.getByRole('button', { name: 'Highest' });
  const taskPriority = await editedTaskPriority.textContent();
  expect(taskPriority).toContain('Highest');

}

async function moveIssue(page) {
//Move issue
await page.getByText('Task title test').click();
await page.getByRole('button', { name: 'Backlog' }).click();
await page.getByText('Selected for Development', { exact: true }).click();
await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
}

async function checkIsIssueMoved(page) {
  //Check if issue is moved
  await page.getByText('Task title test').click();
  await expect(page.getByRole('button', { name: 'Selected for Development' })).toBeVisible();
}

async function deleteIssue(page) {
  //Delete issue
  await page.getByText('Task title test').click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(1).click();
  await page.getByRole('button', { name: 'Delete' }).click();
}

async function checkIfIssueDeleted(page) {
  //Check if issue is deleted
  await expect(page.getByText('Task title test')).toBeHidden();
}


});;