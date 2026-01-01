import {expect, Locator, Page} from "@playwright/test";
import TodoItem from "../organisms/TodoItem";
import {SERVICE_URL} from "../../env/env-data";

export class Home {
    readonly page: Page;
    readonly header: Locator;
    readonly main: Locator;
    readonly footer: Locator;
    readonly toDoList: Locator;
    readonly newTodoInput: Locator;
    readonly filterCompletedButton: Locator;
    readonly clearCompletedButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.getByTestId("header");
        this.main = page.getByTestId("main");
        this.footer = page.getByTestId("footer");
        this.toDoList = this.main.getByTestId("todo-list");
        this.newTodoInput = this.header.getByTestId("text-input")
        this.filterCompletedButton = this.footer.locator('a[href="#/completed"]')
        this.clearCompletedButton = this.footer.locator(".clear-completed");
    }

    private get todoItems(): Locator {
        return this.toDoList.getByTestId("todo-item");
    }

    async goto(): Promise<void> {
        await this.page.goto(SERVICE_URL)
    }

    async createItem(text: string): Promise<TodoItem> {
        await this.newTodoInput.fill(text);
        await this.newTodoInput.press("Enter");
        const allItemsCount = await this.todoItems.count();
        const lastItem = this.todoItems.nth(allItemsCount !== 0 ? allItemsCount-1 : 0)

        return new TodoItem(lastItem);
    }

    async checkCountOfItems(expectedCount: number): Promise<void> {
        const itemsCount = await this.todoItems.count()
        expect(itemsCount).toBe(expectedCount)
    }

    async checkVisibleItemsCount(expectedItems: number): Promise<void> {
        const visibleItems = await this.todoItems.filter({has: this.page.locator(':visible')}).count()
        expect(visibleItems).toBe(expectedItems)
    }

    async clickClearCompletedButton(): Promise<void> {
        await this.clearCompletedButton.click()
    }

    async clickCompletedButton(): Promise<void> {
        await this.filterCompletedButton.click()
    }
}