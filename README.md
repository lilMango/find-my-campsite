# find-my-campsite

Simple script that will alert you if an opening becomes available for a given campsite on recreation.gov.

Currently has to be run manually and will only alert you by logging out to the console the '# of campsite(s) available' line parsed from the response html. This could be infinitely more useful if a simple script was added to run this continuously for a given search and alerting was made more visible, possibly through email or text. Stretch goal would be automatic booking.

Wishlist of features - https://trello.com/b/wYBXnG9N/find-my-campsite 

Also, may be worth it to stress test this and see how many calls recreation.gov will allow a client to make per day before blocking them...

---
### To run:

- add gmail credentials to config.json (for both recipient and sender)
- ``` mvn install ```
- ``` mvn exec:java -Dexec.mainClass="FindReservation" ```

