import asyncio
import aiohttp

async def first_task():
    print(f'Initializin first task')
    await asyncio.sleep(2)
    print(f'First task completed!')
    
async def second_task():
    print(f'Initializin second task')
    await asyncio.sleep(1)
    print(f'Second task completed!')
    
async def fetch_url(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            print(f'Url fetched! {url}')
            return await response.text()

    
async def main():
    urls = ["https://example.com", "https://httpbin.org/get"]
    await asyncio.gather(first_task(),second_task())
    # results = await asyncio.gather(*(fetch_url(url) for url in urls))
    
    # print("All URLs fetched!")


asyncio.run(main())