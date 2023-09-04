from flask import Flask, render_template, request, jsonify
from bs4 import BeautifulSoup
import requests

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape():
    url = 'https://trends24.in/nigeria/'
    response = requests.get(url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        # Perform web scraping here and store data in a Python list of dictionaries
        trends = []

        # Example: Scraping trend data
        trend_elements = soup.find_all('div', class_='trend-card')
        for trend_element in trend_elements:
            trend_list = []
            ol_element = trend_element.find('ol', class_='trend-card__list')
            trend_items = ol_element.find_all('li')

            for trend_item in trend_items:
                anchor_element = trend_item.find('a')
                tweet_count_element = trend_item.find('span', class_='tweet-count')

                if anchor_element and tweet_count_element:
                    trend_text = anchor_element.text
                    tweet_count = tweet_count_element.text
                    trend_list.append({'trendText': trend_text, 'tweetCount': tweet_count})

            trends.append(trend_list)

        # Flatten the list
        flat_trends = [item for sublist in trends for item in sublist]

        return jsonify(flat_trends)  # Return scraped data as JSON
    else:
        return jsonify({'error': 'Failed to scrape data'})


if __name__ == '__main__':
    app.run(debug=True)
