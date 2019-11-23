# Belanja Frontend
![alt text](https://raw.githubusercontent.com/alanpoon/belanja_node/xpay/belanja.png)

A resturant treat giving application built using blockchain. Consumer can identify the table he/she would like to pay for using cyclinder-shaped panorama of the resturant's interior. This is cyclinder-shaped panorama is also called (floorplan) in the source code.

All uploaded images are stored in IPFS and it's hash and ipfs address are stored. Most function agruments are alphabetically ordered.

* Node->[belanja_node](https://github.com/alanpoon/belanja_node)
* Old Node->[belanja_old_node](https://github.com/alanpoon/belanja_server)

Diner module includes:
* Profile creation-> Profile name and Profile image
* Floorplan belanja-> Selection of the table(diner) in the floorplan
* Display of diner's food orders-> Image of the food, Name of the food, Quantity of the food and Price of the foor

Resturant module includes:
* Floorplan creation-> Description, image, tables' coordinates in the floorplan also known as(cubes)
* Floorplan editor-> Addition and removal of cubes in the floorplan

Google places and Map encoding API:
* create an .env file and add REACT_APP_GOOGLE_API_KEY= YourAPIKey

### TODO:
- [x] Include google places search
- [x] Test google places search
- [ ] Profile
- [ ] Improve wallet in react native
- [ ] Fix compatability to the latest belanja_node
- [ ] Change Add item into floorplan to add item into diner
- [ ] Fix query button

### Screenshots
* Add new floorplan
![Floorplanmanager](https://raw.githubusercontent.com/alanpoon/belanja_app/master/screenshots/floorplanmanager.png)

* Edit and save the position of the tables. Query button to query the unbilled food items on the table
![Floorplaneditor](https://raw.githubusercontent.com/alanpoon/belanja_app/master/screenshots/floorplaneditor.png)

* Create a bottle of water and set the price
![Food_menu_creation](https://raw.githubusercontent.com/alanpoon/belanja_app/master/screenshots/addbottle.png)

* Add the item to diner
![Allocation_of_item](https://raw.githubusercontent.com/alanpoon/belanja_app/master/screenshots/additem.png)

