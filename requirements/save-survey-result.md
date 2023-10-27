# Save a Survey Result

> ## Success case

1. ✅ Receive a **PUT** on **/api/surveys/{survey_id}/result**
2. ✅ Check if requisition was done by an **user**
3. ✅ Check for required fields (**survey_id**, **answer**)
4. ✅ Check if **answer** is valid
5. ✅ **Create** a survey result with the data provided if no survey result with **survey_id** and **answer** was found
6. ✅ **Update** a survey result with the data provided if a survey result with **survey_id** and **answer** was found
7. ✅ Returns **200** with the survey result data

> ## Exceptions

1. ✅ Returns **404** if API does not exist
2. ✅ Returns **403** if it is not an user
3. ✅ Returns **403** if survey_id is invalid
4. ✅ Returns **403** if answer is invalid
5. ✅ Returns **500** if any internal operation generates an exception