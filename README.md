# Stock Alert - "Cheeki Breeki"
You'll never miss a market opportunity again!!
Stock alert is bot which monitor stock trade and push result of analyze to Slack Channel "make-money-stay-cheeki-breeki".
Raport about current situation is generated every night. You can decide if the alert is important for you or not.

Stock-alert is fully open to cooperate with functional and technical specialists. Please contact under artur.kondziela@gmail.com.

## Current supported metrics:
 1. yearly realative low price of company
 2. bootm intersection of mean
 3. candle event
 4. considerable increase in volume
 5. considerable increase in price
 6. considerable decrease in price
 7. hole on chart between yesterdays close and todays open
 
## Values for metrics
 1. is in low 33 % of days median
 2. 14 days mean
 3. -
 4. twice bigger volume
 5. increase of 5 %
 6. decrease of 5 %
 7. change by 1%
 
## Price prediction
For companies which are sent to Slack,  tomorrow price is counted with use polynomial regression. Degree values from the set [1 .. 10] are measured for data from last year. The best result is used for prediction for tomorrow.
 
## Current monitored companies:
 - AMD
 - Microsoft
 - Tesla
 - Amazon
 - Take-Two
 - Activision Blizzard
 - Nvidia
 - Intel
 - Google
 - Apple
 - Facebook
 - Cisco
 - Atlassian
 - Dell
 
# Development

Application is developed in NodeJS and hosted on Heroku.

## Future features:
 - monitor the appearance of holes
 - add new markets and companies
 - technical analyzies
 - sell/buy events
 
### Usefull hints
 heroku logs --app arti-stock-cheeki-breeki --tail

### Testing:
 For test using is NodeJS library "JUnit". The library should be install globaly. Test can be run by command: "npm test"
