# stock-alert
You'll never miss a market opportunity again!!
Stock alert is comfortable tool which inform group of users about possible extra prices on stock trade.
Raport about current situation is generated every night and sended to users. They can decide if alert is important for they or not.

How to start:
 - add file token.js with your https://www.tiingo.com/ token in root path
 	module.exports = "YOUR TOKEN"

Application is deployed on heroku.com. Logs: heroku logs --app arti-stock-cheeki-breeki --tail

Current use metrics:
 - check if current price is in 10% of the lowest close prices in last year

 Future metrics:
  - use of daily high, low and open prices
  - check if application price is down
  - short time price analyze (big fall)
  - median analyze
  - technical analyzes

 Possible development:
  - add another api
  - add more companies
  - add more users
  - refactor
  - inform about the best sell time


