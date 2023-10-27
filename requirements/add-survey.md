# Create a Survey

> ## Success case

1. ✅ Rceive a **POST** on **/api/surveys**
2. ✅ Check if requisition was done by an **admin**
3. ✅ Check for required fields (**question**, **answers**)
4. ✅ **Create** a survey with the data provided
5. ✅ Returns **204**, without data

> ## Exceptions

1. ✅ Returns **404** if API does not exist
2. ✅ Returns **403** if user is not an **admin**
3. ✅ Returns **400** if required fields were not provided
4. ✅ Returns **500** if any internal operation generates an exception