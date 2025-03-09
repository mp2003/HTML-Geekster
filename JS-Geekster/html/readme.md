Fetching and Processing Phone Data

Overview

This function, fetchPhones, retrieves phone data from an external API based on a given search term. It processes the received data and formats it before storing it in an array (loadedPhones).

How It Works
	1.	Constructing the API URL:
	•	The function accepts a searchItem parameter and appends it to the API URL.
	•	const url = \https://openapi.programming-hero.com/api/phones?search=${searchItem}`;`
	2.	Fetching Data Asynchronously:
	•	The fetch API is used with await to retrieve data asynchronously.
	•	const response = await fetch(url);
	3.	Parsing JSON Response:
	•	The response is converted to JSON format using await response.json();
	4.	Processing the Retrieved Data:
	•	The function checks data.status to verify if the API request was successful.
	•	If successful, it iterates through data.data (an array of phone objects) and extracts relevant properties.
	•	The extracted information is stored in loadedPhones, a global array.

JavaScript Functionality Used
	•	async & await for handling asynchronous operations.
	•	fetch() to make HTTP requests.
	•	Template literals for dynamically constructing the API URL.
	•	for loop to iterate over the retrieved phone data.
	•	Object manipulation to structure the extracted data properly.
	•	Error handling through an if condition to handle failed API requests.

This function provides a structured and efficient way to retrieve, process, and store phone details dynamically based on user input.