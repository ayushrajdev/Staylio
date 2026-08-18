package middlewares

import (
	"ApiGateway/dtos"
	"ApiGateway/utils"
	"context"
	"fmt"
	"net/http"
)

func ValidateLoginUserRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// before handler
		var payload dtos.VerifyUserDTO

		// JSON -> struct
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			fmt.Println("error while reading the request body:", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// struct validation
		if err := utils.Validator.Struct(payload); err != nil {
			fmt.Println("validation error:", err)
			http.Error(w, "Validation failed", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "payload", payload)
		next.ServeHTTP(w, r.WithContext(ctx))

		// after handler
	})
}
func ValidateCreateUserRequest(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// before handler

		//this will be covert the json body to the struct object and validate the struct object
		var payload dtos.CreateUserDTO

		// JSON -> struct
		// it will read the data from the request body chunk by chunk and store it in the payload struct object
		if err := utils.ReadJsonBody(r, &payload); err != nil {
			fmt.Println("error while reading the request body:", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}

		// struct validation
		if err := utils.Validator.Struct(payload); err != nil {
			fmt.Println("validation error:", err)
			http.Error(w, "Validation failed", http.StatusBadRequest)
			return
		}

		ctx := context.WithValue(r.Context(), "payload", payload)
		next.ServeHTTP(w, r.WithContext(ctx))

	})
}
