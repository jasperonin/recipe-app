import asyncio
from playwright.async_api import async_playwright

async def test_login(user_credentials: list[dict]):
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Go to the Sauce Demo website
        await page.goto("https://www.saucedemo.com/")

        for credentials in user_credentials:
            username = credentials['username']
            password = credentials['password']

            print(f"Testing credentials: Username='{username}', Password='{password}'")

            # Input credentials and log in
            await page.fill("#user-name", username)
            await page.fill("#password", password)
            await page.click("#login-button")

            # Check for login success or failure
            try:
                # Check for an error message for incorrect credentials
                await page.wait_for_selector("h3[data-test='error']", timeout=3000)
                error_message = await page.inner_text("h3[data-test='error']")
                print(f"Login failed for Username='{username}': {error_message}")
            except:
                try:
                    # If no error message, check if login was successful
                    await page.wait_for_selector(".inventory_list", timeout=3000)
                    print(f"Login successful for Username='{username}'.")
                except:
                    print(f"Login failed for Username='{username}': Unable to determine the issue.")
            
            # Return to the login page for the next test
            await page.goto("https://www.saucedemo.com/")

        # Close the browser
        await browser.close()

async def test_shopping_cart():
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context()
        page = await context.new_page()

        # Step 1: Go to the login page
        await page.goto('https://www.saucedemo.com/')

        # Step 2: Login with valid credentials
        await page.fill("#user-name", "standard_user")  # Enter username
        await page.fill("#password", "secret_sauce")   # Enter password
        await page.click("#login-button")             # Click the login button

        # Step 3: Verify login success by checking inventory page
        try:
            await page.wait_for_selector(".inventory_list", timeout=3000)
            print("Login successful.")
        except Exception:
            print("Login failed.")
            await browser.close()
            return

        # Step 4: Add an item to the cart
        await page.click("button[name='add-to-cart-sauce-labs-backpack']")  # Add a product

        # Step 5: Navigate to the cart
        await page.goto('https://www.saucedemo.com/cart.html')

        # Step 6: Click checkout
        try:
            await page.click('#checkout')
            print("Checkout button clicked successfully.")
        except Exception:
            print("Failed to find or click the checkout button.")
        
        # Close the browser
        await browser.close()

# Test with an array of credentials
test_users = [
    {"username": "standard_user", "password": "secret_sauce"},  # Valid credentials
    {"username": "locked_out_user", "password": "secret_sauce"},  # Valid but locked user
    {"username": "fake_user", "password": "fake_password"},       # Invalid credentials
]

# Run the test
asyncio.run(test_shopping_cart())
