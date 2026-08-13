package response

import (
	"encoding/json"
	"net/http"
)

func WriteJsonResponse(w http.ResponseWriter, status int, data any) error {
	w.Header().Set("Content-Type", "application/json") // Set the content type to application/json
	w.WriteHeader(status)                              // Set the HTTP status code
	return json.NewEncoder(w).Encode(data)             // Encode the data as JSON and write it to the response
}

func WriteJsonSuccessResponse(w http.ResponseWriter, status int, message string, data any) error {
	response := map[string]any{}
	response["status"] = "success"
	response["message"] = message
	response["data"] = data
	return WriteJsonResponse(w, status, response)
}

func WriteJsonErrorResponse(w http.ResponseWriter, status int, message string, err error) error {
	response := map[string]any{}
	response["status"] = "error"
	response["message"] = message
	response["error"] = err.Error()
	return WriteJsonResponse(w, status, response)
}
