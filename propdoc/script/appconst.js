apiUrl = "https://directors-wifi-bloomberg-inns.trycloudflare.com/api/";
userRole = "admin"; // Change this to 'agent', 'trader', or 'admin' as needed
jwtToken = localStorage.getItem("jwtToken");
userName = ''

// error msg for Toastify
//  login , register , add image , otp

propBookTsySuccess = 'successfully.' // api  for propertices book url: apiUrl + 'PropertyBook' 
propBookTsyUnSuccess = 'Unsuccessfully.'

propEditTsySuccess = 'successfully.' // api  for propertices edit url: apiUrl + 'PropertyBook?id=' + id 
propEditTsyUnSuccess = 'Unsuccessfully.'    

TaddJobsFromDash = 'successfully.' // add jobs from dash confirmAction()
FaddJobsFromDash = 'Unsuccessfully.'    

TupdateProfile = 'successfully.' // update propfile fillUserData()
FupdateProfile= 'Unsuccessfully.'     

TchangePassword = 'successfully.' // change password forgotPassword()
FchangePassword = 'Unsuccessfully.'     

TsaveProp= 'successfully.' // save propertics from create service page saveProprtices()
FsaveProp = 'Unsuccessfully.'     

TchangeStatus = 'successfully.' // status change from myprop page statuschange()
FchangeStatus  = 'Unsuccessfully.'     

TDeleteService = 'successfully.' // delete  service from service page
FDeleteService  = 'Unsuccessfully.'     



// error msg
//  login
//  reg
//  create services
// add propertices 
// forgot pass
// update user

// sign up error
SignupFirstName = 'please enter a first name.'
SignupLastName = 'please enter a last name.'
SignupEmail = 'please enter an email.'
SignupNumber = 'please enter a contact number.'
SignupPassword = 'please enter a password.'
SignupConfirmPassword = 'please enter a confirm password.'

otpEmptyError = 'please enter a valid 6-digit OTP.'
otpInvalidError = 'Invalid OTP or Expire OTP.'

// login error msg
LoginEmailError = 'The username provided does not exist.'
LoginPasswordError = 'Password incorrect.'

// add jobs & services
AddServicePropertices = 'please select a propertices.'
AddServiceServiceList = 'please select a Services.'
AddServiceComment = 'please enter a comments.' 
AddserviceDate = 'please select a data.'
