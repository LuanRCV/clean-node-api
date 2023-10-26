# Signup

> ## Success case

1. ✅ Receive a **POST** on **/api/signup**
2. ✅ Check for required fields (**name**, **email**, **password** e **passwordConfirmation**)
3. ✅ Check if **password** and **passwordConfirmation** are the same
4. ✅ Check if **email** is valid
5. ✅ Check if there is already a user with the email provided
6. ✅ Create a **hashed** password
7. ✅ **Create** an account with the data provided, but with the hashed password
8. ✅ Generate an **accesToken** from user **id**
9. ✅ **Update** user **accessToken**
10. ✅ Returns **200** with user's access token

> ## Exceptions

1. ✅ Returns **404** if API does not exist
2. ✅ Returns **400** if required fields were not provided
3. ✅ Returns **400** if **password** and **passwordConfirmation** are not the same
4. ✅ Returns **400** if provided email is invalid
5. ✅ Returns **403** if provided email is already in use
6. ✅ Returns **500** if any internal operation generates an exception