# List Surveys

> ## Success case

1. ✅ Receive a **GET** on **/api/surveys**
2. ✅ Check if requisition was done by an **user**
3. ✅ Returns **204** if there is no Survey
4. ✅ Returns **200** with all surveys data

> ## Exceptions

1. ✅ Returns **404** if API does not exist
2. ✅ Returns **403** if it is not an user
3. ✅ Returns **500** if any internal operation generates an exception