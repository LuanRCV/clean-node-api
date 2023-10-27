# Login

> ## Success case

1. ✅ Rceive a **POST** on **/api/login**
2. ✅ Check for required fields (**email**, **password**)
3. ✅ Check if **email** is valid
4. ✅ **Search** for the user with email and password sent
5. ✅ Generate an **accesToken** from user **id**
6. ✅ **Update** user **accessToken**
7. ✅ Returns **200** with user's access token

> ## Exceptions

1. ✅ Returns **404** if API does not exist
2. ✅ Returns **400** if required fields were not provided
3. ✅ Returns **400** if provided email is invalid
4. ✅ Returns **401** if it is not an user
5. ✅ Returns **500** if any internal operation generates an exception