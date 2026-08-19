package utils

import (
	"encoding/json"
	"github.com/go-playground/validator/v10"
	"net/http"
)

var Validator *validator.Validate

func init() {
	Validator = validator.New(validator.WithRequiredStructEnabled())
}

func ReadJsonBody(r *http.Request, result any) error {
	decoder := json.NewDecoder(r.Body)
	decoder.DisallowUnknownFields() // Prevent unknown fields from being included in the JSON body
	return decoder.Decode(result)
}




