package utils

import (
	"encoding/json"
	"net/http"
)

func WriteHttpResponse(w http.ResponseWriter , status int , data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
func ReadReqBody(r *http.Request , result any) {
	decoder:= json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields()
	decoder.Decode(result)

}