apiUrl = "https://kick-friend-context-atmospheric.trycloudflare.com/api/";
userRole = "admin"; // Change this to 'agent', 'trader', or 'admin' as needed
jwtToken = localStorage.getItem("jwtToken");


// error msg for Toastify

loginTsySuccess = 'successfully.';  // api url: apiUrl + 'login' 
loginTsyUnSuccess = 'Unsuccessfully.';

regiTsySuccess = 'successfully.' // api  url: apiUrl + 'register', 
regiTsyUnSuccess = 'Unsuccessfully.'

propBookTsySuccess = 'successfully.' // api  for propertices book url: apiUrl + 'PropertyBook' 
propBookTsyUnSuccess = 'Unsuccessfully.'

propEditTsySuccess = 'successfully.' // api  for propertices edit url: apiUrl + 'PropertyBook?id=' + id 
propEditTsyUnSuccess = 'Unsuccessfully.'  // **note : not implemented

